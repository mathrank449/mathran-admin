import { useEffect, useState } from "react";
import type { ResourceType } from "../types/resource";
import { getDetailedResource } from "../apis/resource";
import type { FileRealInfo } from "../../../shared/type/file";
import { extractYoutubeEmbed } from "../../../shared/utils/extractYoutubeEmbed";
import ReadOnlyReactQuillEditor from "../../solutionBoard/write/components/ReadOnlyReactQuillEditor";
import { downloadFile } from "../../../shared/apis/file";
import { useNavigate } from "@tanstack/react-router";

function ResourceDetailPage({ id }: { id: string }) {
  const navigate = useNavigate();
  // 제목, 카테고리, 파일, 영상 링크 상태
  const [title, setTitle] = useState("자료1번입니다.");
  const [resourceCategory, setResourceCategory] =
    useState<ResourceType>("schoolPaper");
  const [text, setText] = useState("");

  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [files, setFiles] = useState<FileRealInfo[]>([]);

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
        setFiles(detailedResource.fileInfos ?? []);
      } else if (detailedResource.resourceType == "video") {
        setVideoLinks(detailedResource.videoLinks ?? []);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="w-full max-w-[1680px] mx-auto mt-24 px-4">
      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
        {/* 제목 */}
        <h1 className="text-4xl font-semibold py-4 px-3 border border-gray-300 rounded-lg">
          {title}
        </h1>

        {/* 카테고리 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-medium">카테고리:</span>
            <span className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-100">
              {resourceCategory === "testPaper"
                ? "문제집"
                : resourceCategory === "schoolPaper"
                ? "내신 문제집"
                : "영상"}
            </span>
          </div>
        </div>
        <hr className="bg-gray-300 h-[1px] border-0 my-12" />
        <div className="view">
          <ReadOnlyReactQuillEditor contents={text} />
        </div>

        <hr className="bg-gray-300 h-[1px] border-0 my-12" />

        {/* 첨부파일 */}
        {files.length > 0 && (
          <div className="">
            <ul className="flex flex-col gap-2">
              {files.map((file) => (
                <li
                  key={file.fileSource}
                  className="flex items-center justify-between bg-[#F2F9FF] rounded-xl px-4 py-2"
                >
                  <div>
                    <span className="text-rbPrimaryColor text-md mr-8">
                      첨부파일
                    </span>
                    <span className="text-gray-800 font-medium truncate max-w-[200px] mr-4">
                      {file.fileRealName}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => {
                      downloadFile(file);
                    }}
                  >
                    <img src="/download.png" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 영상 */}
        {resourceCategory === "video" && videoLinks.length > 0 && (
          <>
            {videoLinks.map((video, index) => (
              <div key={index} className="mt-4">
                <div className="yt-wrapper">
                  <div className="yt-frame-container relative w-full pt-[56.25%] rounded-md overflow-hidden">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={`${extractYoutubeEmbed(
                        video
                      )}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`}
                      title={`YouTube video player ${index}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="text-right space-x-4 mr-24">
        <button
          onClick={() => navigate({ to: `/resource/${id}/modify` })}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition cursor-pointer"
        >
          수정
        </button>

        <button
          onClick={() => navigate({ to: `/resource` })}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition cursor-pointer"
        >
          목록으로
        </button>
      </div>

      <hr className="bg-gray-300 h-[1px] border-0 my-12" />
    </div>
  );
}

export default ResourceDetailPage;
