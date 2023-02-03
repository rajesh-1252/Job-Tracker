import React, { useReducer, useContext } from "react";
import {
  CHANGE_PAGE,
  CLEAR_ALERT,
  CLEAR_FILTERS,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_ERROR,
  CREATE_JOB_SUCCESS,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  DISPLAY_ALERT,
  EDIT_JOB_BEGIN,
  EDIT_JOB_ERROR,
  EDIT_JOB_SUCCESS,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  HANDLE_CHANGE,
  LOGIN_USER_BEGIN,
  LOGIN_USER_ERROR,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER_BEGIN,
  REGISTER_USER_ERROR,
  REGISTER_USER_SUCCESS,
  SET_EDIT_JOB,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  TOGGLE_SIDEBAR,
  UPDATE_USER_BEGIN,
  UPDATE_USER_ERROR,
  UPDATE_USER_SUCCESS,
} from "./actions";
import reducer from "./reducer";
import axios from "axios";
const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  showSidebar: false,
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  userLocation: localStorage.getItem("location"),

  // jobs
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "declined"],
  status: "pending",

  // search jobs container
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],

  // get jobs
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,

  // stats

  stats: {},
  monthlyApplications: [],
};

const AppContext = React.createContext();
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "/api/v1",
  });
  // request
  authFetch.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${state.token}`;

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // response

  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.log(error.response);
      if (error.response.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  const addUserToLocalStorage = (user, token, location) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };
  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("location");
  };
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const { data } = await axios.post("/api/v1/auth/register", currentUser);
      const { user, token, location } = data;
      addUserToLocalStorage(user, token, location);
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
    } catch (error) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post("/api/v1/auth/login", currentUser);
      const { user, token, location } = data;
      addUserToLocalStorage(user, token, location);
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
        },
      });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: {
          msg: error.response.data.msg,
        },
      });
    }
    clearAlert();
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, location, token } = data;
      console.log(token);
      console.log(data);
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: {
          user,
          location,
          token,
        },
      });
      addUserToLocalStorage(user, location, token);
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    clearAlert();
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs", {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      clearValues();
    } catch (error) {
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  const getJobs = async () => {
    const { search, page, searchStatus, searchType, sort } = state;
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      console.log(error.response);
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async (id) => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
    } catch (error) {
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${id}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });

      console.log(error.response.data);
      // logoutUser()
    }
    clearAlert();
  };

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch("/jobs/stats");
      const { defaultStats, monthlyApplications } = data;
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: defaultStats,
          monthlyApplications,
        },
      });
    } catch (error) {
      console.log(error.response);
      // logoutUser()
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        toggleSidebar,
        handleChange,
        clearValues,
        clearFilters,
        changePage,
        logoutUser,
        registerUser,
        loginUser,
        updateUser,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
const useAppContext = () => {
  return useContext(AppContext);
};
export { AppProvider, useAppContext, initialState };
