import { type SetStateAction } from "react";
import type { FileInfo } from "../../../shared/type/file";
import { uploadFileToServer } from "../../../shared/apis/file";

function MultiFileUpload({
  files,
  setFiles,
}: {
  files: FileInfo[];
  setFiles: React.Dispatch<SetStateAction<FileInfo[]>>;
}) {
  /** 파일 선택 시 */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const newFile = target.files?.[0];
    if (!newFile) return;

    const newFileSource = await uploadFileToServer(newFile);

    setFiles((prev) => [
      ...prev,
      {
        fileName: newFile.name,
        fileSource: newFileSource,
      },
    ]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하게 초기화
  };

  /** 파일 수정 (해당 파일만 변경) */
  const handleEditClick = async (fileSource: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const newFile = target.files?.[0];
      if (!newFile) return;

      const newFileSource = await uploadFileToServer(newFile);

      setFiles((prev) =>
        prev.map((item) =>
          item.fileSource === fileSource
            ? {
                fileName: newFile.name,
                fileSource: newFileSource,
              }
            : item
        )
      );
    };
    input.click();
  };

  /** 파일 삭제 */
  const handleDeleteClick = (fileSource: string) => {
    setFiles((prev) => prev.filter((item) => item.fileSource !== fileSource));
  };

  return (
    <div className="mt-3 space-y-3">
      <div>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="multiFileUpload"
        />
        <label
          htmlFor="multiFileUpload"
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 transition"
        >
          파일 선택
        </label>
      </div>

      {/* 업로드된 파일 리스트 */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(({ fileSource, fileName }) => (
            <li
              key={fileSource}
              className="flex items-center justify-between bg-gray-100 rounded p-2"
            >
              <span className="text-gray-800 font-medium truncate max-w-[200px]">
                {fileName}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(fileSource)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteClick(fileSource)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MultiFileUpload;
