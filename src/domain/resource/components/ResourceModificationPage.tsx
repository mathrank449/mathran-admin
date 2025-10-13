import { useEffect, useRef, useState } from "react";
import type { ResourceType } from "../types/resource";
import FileUpload from "./FileUpload";
import VideoLinkInput from "./VideoLinkInput";
import ReactQuillEditor from "../../solutionBoard/write/components/ReactQuillEditor";
import type ReactQuill from "react-quill-new";
import { getDetailedResource, modifyResource } from "../apis/resource";
import type { FileInfo } from "../../../shared/type/file";
import { useNavigate } from "@tanstack/react-router";

function ResourceModificationPage({ id }: { id: string }) {
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);
  const [resourceCategory, setResourceCategory] =
    useState<ResourceType>("testPaper");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const detailedResource = await getDetailedResource(id);
      console.log(detailedResource);
      setTitle(detailedResource.title);
      setResourceCategory(detailedResource.resourceType);
      setText(detailedResource.text);

      if (
        detailedResource.resourceType == "testPaper" ||
        detailedResource.resourceType == "schoolPaper"
      ) {
        setFiles(
          detailedResource.fileInfos?.map((file) => ({
            fileName: file.fileRealName,
            fileSource: file.fileSource,
          })) ?? []
        );
      } else if (detailedResource.resourceType == "video") {
        setVideoLinks(detailedResource.videoLinks ?? []);
      }
    };

    fetchData();
  }, [id]);

  const onHandleModify = async () => {
    try {
      if (title == "") {
        alert("제목을 입력해주세요");
        return;
      }

      await modifyResource(id, {
        resourceType: resourceCategory,
        title,
        text: quillRef.current?.getEditor().root.innerHTML ?? "",
        price,
        file: files,
        videoLinks,
      });
      alert("자료 업로드에 성공하였습니다.");
      navigate({ to: "/resource" });
    } catch (e) {
      console.log(e);
      alert("자료 업로드에 실패하였습니다.");
    }
  };

  return (
    <div className="w-full max-w-[1680px] mx-auto mt-24 px-4">
      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
        {/* 제목 입력 */}
        <input
          className="text-4xl font-semibold py-4 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="제목을 입력하세요."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />

        {/* 카테고리 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label htmlFor="category" className="font-medium">
                카테고리
              </label>
              <select
                id="category"
                name="category"
                value={resourceCategory} // 상태와 연결
                onChange={(e) =>
                  setResourceCategory(e.target.value as ResourceType)
                } // 선택 변경 시 상태 업데이트
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="testPaper">문제집</option>
                <option value="schoolPaper">내신 문제집</option>
                <option value="video">영상</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="금액을 입력해주세요"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                step={100}
                className="w-40 px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-gray-800"
              />
              <span className="text-gray-600">₩(원)</span>
            </div>
          </div>
        </div>

        {/* 에디터 */}
        {/* 에디터 */}
        <div className="border border-gray-300 rounded-lg overflow-hidden write">
          <ReactQuillEditor ref={quillRef} value={text} />
        </div>

        {resourceCategory === "testPaper" && (
          <div>
            <FileUpload files={files} setFiles={setFiles} />
          </div>
        )}
        {resourceCategory === "schoolPaper" && (
          <div>
            <FileUpload files={files} setFiles={setFiles} />
          </div>
        )}
        {resourceCategory === "video" && (
          <div>
            <VideoLinkInput
              videoLinks={videoLinks}
              setVideoLinks={setVideoLinks}
            />
          </div>
        )}
        <div className="flex justify-center gap-6">
          <button
            className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
            onClick={onHandleModify}
          >
            자료 수정
          </button>
          <button
            className="my-3 cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white"
            onClick={() => {
              navigate({ to: `/resource/${id}` });
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResourceModificationPage;
