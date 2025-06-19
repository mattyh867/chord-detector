

const Nav = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Note Coach</div>
        <ul className="flex space-x-4">
          <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;