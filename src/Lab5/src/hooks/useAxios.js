import axios from "axios";
import { useState, useEffect } from "react";

const useAxios = (url) => {
    const [state, setState] = useState({
        data: null,
        loading: true,
        error: null
    });

    useEffect(() => {
        setState((state) => ({ data: state.data, loading: true, error: null }));
        axios
            .get(url)
            .then(({ data }) => {
                setState({ data: data, loading: false, error: null });
                console.log(data);
            })
            .catch((err) => {
                setState((state) => ({
                    data: state.data,
                    loading: false,
                    error: err
                }));
            });
    }, [url, setState]);

    return state;
};

export default useAxios;
