interface ProblemDetailPageProps {
  problemId: string | number;
}

function ProblemDetailPage({ problemId }: ProblemDetailPageProps) {
  return (
    <div>
      <h1>문제 상세 페이지</h1>
      <p>문제 ID: {problemId}</p>
    </div>
  );
}

export default ProblemDetailPage;
