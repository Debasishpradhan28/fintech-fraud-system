import BottomNav from "./BottomNav";

function Layout({ children }: any) {

    return (

        <div
            className="
            min-h-screen

            bg-slate-100

            pb-28
            "
        >

            <main
                className="
                max-w-[1700px]

                mx-auto

                px-5
                lg:px-8

                pt-6
                "
            >

                {children}

            </main>

            <BottomNav />

        </div>

    );

}

export default Layout;