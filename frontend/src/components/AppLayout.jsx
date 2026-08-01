import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

const AppLayout = ({ title, children }) => {
  return (
    <div className="flex h-screen w-full bg-ink overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
