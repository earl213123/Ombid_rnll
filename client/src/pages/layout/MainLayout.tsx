import Navbar from "../../components/Navbar";

interface MainLayoutProps {
  content: React.ReactNode;
}
const MainLayout = ({ content }: MainLayoutProps) => {
  return (
    <>
      <div className="container-fluiid">
        <Navbar />

        <div>{content}</div>
      </div>
    </>
  );
};

export default MainLayout;
