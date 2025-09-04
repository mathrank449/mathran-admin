import { useContestStore } from "../hooks/useContestStore";
import EnrollTestPapersOnePage from "./EnrollTestPapersOnePage";
import EnrollTestPapersPageThree from "./EnrollTestPapersPageThree";
import EnrollTestPapersPageTwo from "./EnrollTestPapersPageTwo";
import TestPapersNav from "./TestPapersNav";

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
        <TestPapersNav />
        <EnrollTestPapersOnePage key="one" />
      </div>
    );

  if (testPapers[selectedIndex] === undefined)
    return (
      <div className="flex justify-center mt-24">
        <TestPapersNav />
        <EnrollTestPapersPageTwo key="two" />
      </div>
    );
  return (
    <div className="flex justify-center mt-24">
      <TestPapersNav />
      <EnrollTestPapersPageThree key="three" />
    </div>
  );
}

export default EnrollContestPage;
