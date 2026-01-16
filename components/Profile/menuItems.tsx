interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

const MenuItem = ({ label, onClick }: MenuItemProps) => {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {label}
    </button>
  );
};

export default MenuItem;
