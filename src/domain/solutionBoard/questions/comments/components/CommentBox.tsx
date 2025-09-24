import type { Comment } from "../../types/question";
import ReadOnlyCommentReactQuillEditor from "./ReadOnlyCommentReactQuillEditor";
import { deleteComment } from "../apis/comment";

function CommentBox({ comment }: { comment: Comment }) {
  const formattedDate = new Date(comment.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const handleDeleteCommentButton = async () => {
    try {
      await deleteComment(comment.commentId);
      window.location.reload();
    } catch (e) {
      alert("댓글 삭제에 실패하였습니다.");
      console.log(e);
    }
  };

  return (
    <div className="border-gray-300 border-[1.5px]">
      <div className="bg-[#f5f5f5] p-2 border-gray-300 border-b-[1.5px] flex items-center">
        <div className="flex-1">
          <span className="font-semibold text-gray-700 px-4">
            {comment.memberInfo.nickName}
          </span>
          <span className="font-semibold text-gray-700">{formattedDate}</span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="cursor-pointer px-3 py-2 rounded-lg shadow transition bg-blue-500 text-white hover:bg-blue-600"
            onClick={handleDeleteCommentButton}
          >
            댓글 삭제
          </button>
        </div>
      </div>
      <ReadOnlyCommentReactQuillEditor contents={comment.content} />
    </div>
  );
}

export default CommentBox;
