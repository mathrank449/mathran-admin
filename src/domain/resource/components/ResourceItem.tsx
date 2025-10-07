import type { ResourceItemType } from "../types/resource";

function ResourceItem({
  resource,
  index,
}: {
  resource: ResourceItemType;
  index: number;
}) {
  return (
    <div
      className={`w-[1500px] whitespace-nowrap py-3 border-solid border-[#DEDEDE] border-2 border-t-0 mx-auto ${
        index % 2 === 0 ? "bg-white " : " bg-gray-100"
      }`}
    >
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(resource.resourceId)}
        >
          {resource.resourceId}
        </span>
      </div>
      <div className="inline-block align-middle w-[550px] text-center overflow-hidden truncate">
        <a
          className="text-sm text-blue-500 whitespace-nowrap mr-4"
          title={String(resource.title)}
          href={`/resource/${resource.resourceId}`}
        >
          {resource.title}
        </a>
      </div>
      <div className="inline-block align-middle w-[400px] text-center overflow-hidden truncate">
        {resource.resourceType === "testPaper" && (
          <span
            className="text-sm text-black whitespace-nowrap mr-4"
            title={String(resource.resourceType)}
          >
            문제집
          </span>
        )}
        {resource.resourceType === "schoolPaper" && (
          <span
            className="text-sm text-black whitespace-nowrap mr-4"
            title={String(resource.resourceType)}
          >
            내신 문제집
          </span>
        )}
        {resource.resourceType === "video" && (
          <span
            className="text-sm text-black whitespace-nowrap mr-4"
            title={String(resource.resourceType)}
          >
            영상
          </span>
        )}
      </div>
      <div className="inline-block align-middle w-[150px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(resource.memberNickName)}
        >
          {resource.memberNickName}
        </span>
      </div>
      <div className="inline-block align-middle w-[200px] text-center overflow-hidden truncate">
        <span
          className="text-sm text-black whitespace-nowrap"
          title={String(resource.createdAt)}
        >
          {new Date(resource.createdAt)
            .toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
            .replace(/\s/g, "")}
        </span>
      </div>
    </div>
  );
}

export default ResourceItem;
