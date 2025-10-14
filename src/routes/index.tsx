import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../shared/components/Header";
import Footer from "../shared/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const features = [
    {
      title: "문제 & 시험지 출제",
      description: "직접 문제와 시험지를 제작하고 관리할 수 있습니다.",
    },
    {
      title: "경시대회 관리",
      description:
        "경시대회를 등록하고 참여자 및 결과를 손쉽게 관리할 수 있습니다.",
    },
    {
      title: "자료 업로드 및 수익화",
      description:
        "학습 자료를 업로드하여 판매하거나 공유해 수익을 창출할 수 있습니다.",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-12 mb-[120px]">
        <img
          src="/mathran_logo.png"
          className="w-48 md:w-64 lg:w-72 mb-6 mx-auto"
        />
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          어드민 서비스 메인페이지
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl">
          문제, 시험지, 경시대회를 출제하고 자료를 업로드해 수익화할 수
          있습니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>
      <div className="static bottom-0 left-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
