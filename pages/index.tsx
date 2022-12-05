import useShortcuts from "../hooks/useShortcuts";

const Home = () => {
  const ENTER = useShortcuts("Enter", () => {
    console.log("Enter pressed");
  });

  const CTRL_A = useShortcuts("Ctrl A", "Command A", () => {
    console.log("Select All");
  });

  useShortcuts("Escape", () => {
    ENTER.setDisabled(!ENTER.getDisabled());
    CTRL_A.setDisabled(!CTRL_A.getDisabled());
  });

  return <h1>Home</h1>;
};

export default Home;
