import { useContestStore } from "../hooks/useContestStore";
import EnrollTestPapersOnePage from "./EnrollContestOnePage";
import EnrollContestTwoPage from "./EnrollContestTwoPage";
import EnrollContestThreePage from "./EnrollContestThreePage";
import ContestNav from "./ContestNav";

function EnrollContestPage() {
  const selectedIndex = useContestStore((state) => state.selectedIndex);
  const testPapers = useContestStore((state) => state.contestProblems);
  const problems = useContestStore((state) => state.problems);

  if (
    problems[selectedIndex].length === 0 &&
    testPapers[selectedIndex] === undefined
  )
    return (
      <div className="flex justify-center mt-24">
        <ContestNav />
        <EnrollTestPapersOnePage key="one" />
      </div>
    );

  if (testPapers[selectedIndex] === undefined)
    return (
      <div className="flex justify-center mt-24">
        <ContestNav />
        <EnrollContestTwoPage key="two" />
      </div>
    );
  return (
    <div className="flex justify-center mt-24">
      <ContestNav />
      <EnrollContestThreePage key="three" />
    </div>
  );
}

export default EnrollContestPage;
