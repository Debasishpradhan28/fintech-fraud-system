function Navbar() {

  const handleLogout = () => {

    localStorage.removeItem("token");

    window.location.href = "/";

  };

  return (

    <div className="
      bg-white
      rounded-2xl
      shadow
      px-6
      py-4
      flex
      justify-between
      items-center
    ">

      <div>

        <h2 className="
          text-2xl
          font-bold
        ">
          Dashboard
        </h2>

        <p className="text-slate-500">
          Monitor fraud activity in real-time
        </p>

      </div>

      <button
        onClick={handleLogout}
        className="
          bg-red-500
          text-white
          px-4
          py-2
          rounded-xl
          hover:bg-red-600
        "
      >
        Logout
      </button>

    </div>

  );

}

export default Navbar;