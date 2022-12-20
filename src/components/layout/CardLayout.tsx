import { CProps } from "../../types/Children";

const CardLayout = ({
  bg = "bg-cyan-900",
  children,
}: CProps<{ bg?: string }>) => {
  return (
    <div className={`flex min-h-screen justify-center items-center p-10 ${bg}`}>
      <div className="card rounded-xl p-10 w-full bg-white max-w-2xl">
        {children}
      </div>
    </div>
  );
};

export default CardLayout;
