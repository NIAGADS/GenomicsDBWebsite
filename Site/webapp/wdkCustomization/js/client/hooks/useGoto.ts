import { useHistory } from "react-router-dom";

const useGoto = () => {
    const history = useHistory();
    return (target: string) => history.push(target);
};

export default useGoto;
