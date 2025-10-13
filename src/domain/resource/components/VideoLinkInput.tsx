import { type SetStateAction } from "react";

interface VideoLinkInputProps {
  videoLinks: string[];
  setVideoLinks: React.Dispatch<SetStateAction<string[]>>;
}

function VideoLinkInput({ videoLinks, setVideoLinks }: VideoLinkInputProps) {
  const handleAddLink = (link: string) => {
    if (!link) {
      alert("링크를 입력해주세요.");
      return;
    }
    setVideoLinks([...videoLinks, link]);
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = videoLinks.filter((_, i) => i !== index);
    setVideoLinks(newLinks);
  };

  const extractYoutubeEmbed = (url: string) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <div className="mt-3 space-y-3">
      {/* 입력 + 추가 버튼 */}
      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="영상 링크를 입력하세요"
          className="border rounded-lg px-3 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => {
            if (e.key === "Enter")
              handleAddLink((e.target as HTMLInputElement).value);
          }}
        />
        <button
          type="button"
          onClick={(e) =>
            handleAddLink(
              (e.currentTarget.previousElementSibling as HTMLInputElement).value
            )
          }
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          추가
        </button>
      </div>

      {/* 영상 리스트 + 미리보기 */}
      <div className="space-y-4">
        {videoLinks.map((link, index) => (
          <div key={index} className="border rounded-lg p-3 relative">
            <div className="relative w-full pt-[56.25%] rounded-md overflow-hidden">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`${extractYoutubeEmbed(
                  link
                )}?autoplay=0&mute=1&rel=0&modestbranding=1`}
                title={`video-${index}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveLink(index)}
              className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoLinkInput;
