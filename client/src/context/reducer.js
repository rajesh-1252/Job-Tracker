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

const reducer = (state, action) => {
  console.log(action.type);
  // common Error handleing
  if (action.type.includes("_ERROR")) {
    state.isLoading = false;
    state.showAlert = true;
    state.alertType = "danger";
  }

  // common begining handling

  if (action.type.includes("_BEGIN")) {
    state.isLoading = true;
  }

  if (action.type === DISPLAY_ALERT) {
    return {
      ...state,
      showAlert: true,
      alertType: "danger",
      alertText: "Please Provide All Values",
    };
  }
  if (action.type === CLEAR_ALERT) {
    return {
      ...state,
      showAlert: false,
      alertType: "",
      alertText: "",
    };
  }
  // ---------------------Register User------------------------//
  if (action.type === REGISTER_USER_BEGIN) {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === REGISTER_USER_SUCCESS) {
    const { user, token, location } = action.payload;
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "User Created! Redirecting...",
      user,
      token,
      userLocation: location,
      jobLocation: location,
    };
  }
  if (action.type === REGISTER_USER_ERROR) {
    return {
      ...state,
      alertText: action.payload.msg,
    };
  }

  // --------------------Login User----------------------------//

  if (action.type === LOGIN_USER_BEGIN) {
    return {
      ...state,
    };
  }
  if (action.type === LOGIN_USER_SUCCESS) {
    const { user, token, location } = action.payload;
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Login Successfull! Redirecting...",
      user,
      token,
      userLocation: location,
      jobLocation: location,
    };
  }

  if (action.type === LOGIN_USER_ERROR) {
    return {
      ...state,
      alertText: action.payload.msg,
    };
  }

  // --------------------toggle sidbar-------------------------//

  if (action.type === TOGGLE_SIDEBAR) {
    return {
      ...state,
      showSidebar: !state.showSidebar,
    };
  }

  if (action.type === LOGOUT_USER) {
    return {
      ...state,
      user: null,
      token: null,
      userLocation: "",
      jobLocation: "",
    };
  }

  //--------------------Update User------------------------------//
  if (action.type === UPDATE_USER_BEGIN) {
    return {
      ...state,
    };
  }
  if (action.type === UPDATE_USER_SUCCESS) {
    return {
      ...state,
      token: action.payload.token,
      user: action.payload.user,
      userLocation: action.payload.location,
      jobLocation: action.payload.location,
      showAlert: true,
      alertType: "success",
      alertText: "User Profile Updated!",
    };
  }
  if (action.type === UPDATE_USER_ERROR) {
    return {
      ...state,
      alertText: action.payload.msg,
    };
  }

  // ------------------ handle form change---------------------//

  if (action.type === HANDLE_CHANGE) {
    return {
      ...state,
      page: 1,
      [action.payload.name]: action.payload.value,
    };
  }

  // -------------------clear values--------------------------//

  if (action.type === CLEAR_VALUES) {
    const initialState = {
      isEditing: false,
      editJobId: "",
      position: "",
      company: "",
      jobLocation: state.userLocation,
      jobType: "full-time",
      status: "pending",
    };
    return { ...state, ...initialState };
  }

  // ------------------- Clear Filters -----------------------//

  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      search: "",
      searchStatus: "all",
      searchType: "all",
      sort: "latest",
    };
  }

  // -------------------- Change Page -----------------------//

  if (action.type === CHANGE_PAGE) {
    return { ...state, page: action.payload.page };
  }

  // ----------------- Create Job ----------------------------//

  if (action.type === CREATE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === CREATE_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "New Job Created!",
    };
  }
  if (action.type === CREATE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  // ------------------Get All Jobs -------------------------//

  if (action.type === GET_JOBS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === GET_JOBS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      jobs: action.payload.jobs,
      totalJobs: action.payload.totalJobs,
      numOfPages: action.payload.numOfPages,
    };
  }

  // ------------------------Edit Job -------------------------//

  if (action.type === SET_EDIT_JOB) {
    const job = state.jobs.find((job) => job._id === action.payload.id);
    const { _id, position, company, jobLocation, jobType, status } = job;
    return {
      ...state,
      isEditing: true,
      editJobId: _id,
      position,
      company,
      jobLocation,
      jobType,
      status,
    };
  }
  if (action.type === EDIT_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }
  if (action.type === EDIT_JOB_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "success",
      alertText: "Job Updated!",
    };
  }
  if (action.type === EDIT_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  // ----------------------Delete Job-------------------------//

  if (action.type === DELETE_JOB_BEGIN) {
    return { ...state, isLoading: true };
  }

  if (action.type === DELETE_JOB_ERROR) {
    return {
      ...state,
      isLoading: false,
      showAlert: true,
      alertType: "danger",
      alertText: action.payload.msg,
    };
  }

  // --------------------- Show Stats ------------------------//

  if (action.type === SHOW_STATS_BEGIN) {
    return { ...state, isLoading: true, showAlert: false };
  }
  if (action.type === SHOW_STATS_SUCCESS) {
    return {
      ...state,
      isLoading: false,
      stats: action.payload.stats,
      monthlyApplications: action.payload.monthlyApplications,
    };
  }

  //---------------catch error if no action is provide-----------//
  throw new Error(`no such action : ${action.type}`);
};

export default reducer;
