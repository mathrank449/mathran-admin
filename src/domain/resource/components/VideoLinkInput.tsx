import { useState } from "react";

function VideoLinkInput() {
  const [videoUrl, setVideoUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const handlePreview = () => {
    const youtubeMatch = videoUrl.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    if (youtubeMatch) {
      setPreviewUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
    } else {
      setPreviewUrl(videoUrl);
    }
  };

  const handleClosePreview = () => {
    setPreviewUrl(""); // 미리보기 종료
  };

  return (
    <div className="mt-3 space-y-3">
      {/* 링크 입력 */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={videoUrl}
          onChange={handleInputChange}
          placeholder="영상 링크를 입력하세요"
          className="border rounded-lg px-3 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        {!previewUrl ? (
          <button
            type="button"
            onClick={handlePreview}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            미리보기
          </button>
        ) : (
          <button
            type="button"
            onClick={handleClosePreview}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            미리보기 종료
          </button>
        )}
      </div>

      {/* 미리보기 영역 */}
      {previewUrl && (
        <div className="mt-4">
          <div className="yt-wrapper">
            <div className="yt-frame-container">
              <iframe
                src={`${previewUrl}?autoplay=1&mute=1&loop=1&color=white&controls=&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoLinkInput;
