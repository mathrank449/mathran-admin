import { useState } from "react";
import type { ResourceType } from "../types/resource";

function ResourceDetailPage({ id }: { id: string }) {
  console.log(id);
  // 제목, 카테고리, 파일, 영상 링크 상태
  const [title] = useState("자료1번입니다.");
  const [resourceCategory] = useState<ResourceType>("schoolPaper");
  const [testFiles] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "문제집1.pdf" },
    { id: "2", name: "문제집2.pdf" },
  ]);
  const [videoUrl] = useState("https://www.youtube.com/embed/1wuDqCi3YHU");

  return (
    <div className="w-full max-w-[1680px] mx-auto mt-24 px-4">
      <div className="w-full max-w-[800px] mx-auto flex flex-col gap-6">
        {/* 제목 */}
        <h1 className="text-4xl font-semibold py-4 px-3 border border-gray-300 rounded-lg">
          {title}
        </h1>

        {/* 카테고리 */}
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

        {/* 파일 리스트 */}
        {(resourceCategory === "testPaper" ||
          resourceCategory === "schoolPaper") &&
          testFiles.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className="font-medium">
                {resourceCategory === "testPaper"
                  ? "문제집 파일"
                  : "내신 문제집 파일"}
              </h2>
              {testFiles.map((file) => (
                <span key={file.id} className="text-gray-700">
                  {file.name}
                </span>
              ))}
            </div>
          )}

        {/* 영상 */}
        {resourceCategory === "video" && videoUrl && (
          <div className="mt-4">
            <div className="yt-wrapper">
              <div className="yt-frame-container">
                <iframe
                  src={`${videoUrl}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&playsinline=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourceDetailPage;
