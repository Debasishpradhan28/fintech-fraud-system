import Sidebar from "./Sidebar";

function Layout({ children }: any) {

  return (

    <div className="flex">

      <Sidebar />

      <main
      className="
      flex-1
      min-w-0
      overflow-x-hidden
      overflow-y-auto
     bg-slate-100
      p-4
     sm:p-6
     lg:p-8
     "
    >
        {children}
      </main>

    </div>

  );

}

export default Layout;