import { useState } from "react";

interface UploadedFile {
  id: number;
  file: File;
}

function MultiFileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  /** 파일 선택 시 */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files).map((file, index) => ({
      id: Date.now() + index, // 고유 ID
      file,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = ""; // 같은 파일 다시 선택 가능하게 초기화
  };

  /** 파일 수정 (해당 파일만 변경) */
  const handleEditClick = (id: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const newFile = target.files?.[0];
      if (!newFile) return;

      setFiles((prev) =>
        prev.map((item) => (item.id === id ? { ...item, file: newFile } : item))
      );
    };
    input.click();
  };

  /** 파일 삭제 */
  const handleDeleteClick = (id: number) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
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
          {files.map(({ id, file }) => (
            <li
              key={id}
              className="flex items-center justify-between bg-gray-100 rounded p-2"
            >
              <span className="text-gray-800 font-medium truncate max-w-[200px]">
                {file.name}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditClick(id)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDeleteClick(id)}
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
