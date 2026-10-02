import React from "react";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import "./../styles/App.css";

const initialState = {
  page: 1,

  profile: {
    fname: "",
    lname: "",
    phone: "",
    address: "",
    url: ""
  },

  education: [
    {
      courseName: "",
      completionYear: "",
      college: "",
      percentage: ""
    }
  ],

  skills: [""],

  projects: [
    {
      projectName: "",
      techStack: "",
      description: ""
    }
  ],

  social: [""]
};

const getInitialState = () => {
  try {
    const saved = localStorage.getItem("resumeBuilderData");

    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.log("Could not load saved resume");
  }

  return initialState;
};

const reducer = (state = getInitialState(), action) => {
  switch (action.type) {

    case "SET_PAGE":
      return {
        ...state,
        page: action.page
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        profile: {
          ...state.profile,
          [action.field]: action.value
        }
      };

    case "UPDATE_EDUCATION":
      return {
        ...state,
        education: state.education.map((item, index) =>
          index === action.index
            ? {
                ...item,
                [action.field]: action.value
              }
            : item
        )
      };

    case "ADD_EDUCATION":
      return {
        ...state,
        education: [
          ...state.education,
          {
            courseName: "",
            completionYear: "",
            college: "",
            percentage: ""
          }
        ]
      };

    case "DELETE_EDUCATION":
      return {
        ...state,
        education:
          state.education.length > 1
            ? state.education.filter(
                (_, index) => index !== action.index
              )
            : state.education
      };

    case "UPDATE_SKILL":
      return {
        ...state,
        skills: state.skills.map((skill, index) =>
          index === action.index
            ? action.value
            : skill
        )
      };

    case "ADD_SKILL":
      return {
        ...state,
        skills: [...state.skills, ""]
      };

    case "DELETE_SKILL":
      return {
        ...state,
        skills:
          state.skills.length > 1
            ? state.skills.filter(
                (_, index) => index !== action.index
              )
            : state.skills
      };

    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((item, index) =>
          index === action.index
            ? {
                ...item,
                [action.field]: action.value
              }
            : item
        )
      };

    case "ADD_PROJECT":
      return {
        ...state,
        projects: [
          ...state.projects,
          {
            projectName: "",
            techStack: "",
            description: ""
          }
        ]
      };

    case "DELETE_PROJECT":
      return {
        ...state,
        projects:
          state.projects.length > 1
            ? state.projects.filter(
                (_, index) => index !== action.index
              )
            : state.projects
      };

    case "UPDATE_SOCIAL":
      return {
        ...state,
        social: state.social.map((item, index) =>
          index === action.index
            ? action.value
            : item
        )
      };

    case "ADD_SOCIAL":
      return {
        ...state,
        social: [...state.social, ""]
      };

    case "DELETE_SOCIAL":
      return {
        ...state,
        social:
          state.social.length > 1
            ? state.social.filter(
                (_, index) => index !== action.index
              )
            : state.social
      };

    case "RESET":
      return initialState;

    default:
      return state;
  }
};

const store = createStore(reducer);

class ResumeBuilder extends React.Component {

  componentDidUpdate() {
    try {
      localStorage.setItem(
        "resumeBuilderData",
        JSON.stringify(this.props.resume)
      );
    } catch (error) {
      console.log("Could not save resume");
    }
  }

  goToPage = (page) => {
    this.props.setPage(page);
    window.scrollTo(0, 0);
  };

  nextPage = () => {
    const { page } = this.props.resume;

    if (page < 5) {
      this.goToPage(page + 1);
    } else {
      this.goToPage(6);
    }
  };

  previousPage = () => {
    const { page } = this.props.resume;

    if (page > 1) {
      this.goToPage(page - 1);
    }
  };

  saveAndContinue = () => {
    try {
      localStorage.setItem(
        "resumeBuilderData",
        JSON.stringify(this.props.resume)
      );
    } catch (error) {
      console.log("Could not save resume");
    }

    this.nextPage();
  };

  updateProfile = (field, value) => {
    this.props.updateProfile(field, value);
  };

  handleImage = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.updateProfile("url", reader.result);
    };

    reader.readAsDataURL(file);
  };

  renderNavigation() {
    const { page } = this.props.resume;

    if (page === 6) {
      return null;
    }

    return (
      <div className="navigation">

        <button
          id="back"
          onClick={this.previousPage}
          disabled={page === 1}
        >
          BACK
        </button>

        <button
          id="next"
          onClick={this.nextPage}
        >
          NEXT
        </button>

        <button
          id="save_continue"
          onClick={this.saveAndContinue}
        >
          SAVE AND CONTINUE
        </button>

      </div>
    );
  }

  renderStepper() {
    const { page } = this.props.resume;

    if (page === 6) {
      return null;
    }

    const steps = [
      "Profile Section",
      "Education Section",
      "Skills Sector",
      "Mini Project",
      "Social"
    ];

    return (
      <div className="stepper">
        {steps.map((step, index) => (
          <React.Fragment key={step}>

            <div
              className={
                page === index + 1
                  ? "step active"
                  : "step"
              }
            >
              <span>{index + 1}</span>
              <strong>{step}</strong>
            </div>

            {index < steps.length - 1 && (
              <div className="step-line"></div>
            )}

          </React.Fragment>
        ))}
      </div>
    );
  }

  renderProfile() {
    const { profile } = this.props.resume;

    return (
      <section className="form-card">

        <h2>Add your profile details</h2>

        <div className="two-column">

          <input
            name="fname"
            placeholder="First Name"
            value={profile.fname}
            onChange={(e) =>
              this.updateProfile("fname", e.target.value)
            }
          />

          <input
            name="lname"
            placeholder="Last Name"
            value={profile.lname}
            onChange={(e) =>
              this.updateProfile("lname", e.target.value)
            }
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={(e) =>
              this.updateProfile("phone", e.target.value)
            }
          />

          <input
            name="address"
            placeholder="Address"
            value={profile.address}
            onChange={(e) =>
              this.updateProfile("address", e.target.value)
            }
          />

        </div>

        <div className="image-input">
          <label>Profile Image</label>

          <input
            type="file"
            name="url"
            accept="image/*"
            onChange={this.handleImage}
          />
        </div>

        {profile.url && (
          <img
            className="profile-preview"
            src={profile.url}
            alt="Profile"
          />
        )}

      </section>
    );
  }

  renderEducation() {
    const { education } = this.props.resume;

    return (
      <section className="form-card">

        <h2>Add your Education</h2>

        {education.map((item, index) => (
          <div className="entry" key={index}>

            <input
              name="courseName"
              placeholder="Course Name *"
              value={item.courseName}
              onChange={(e) =>
                this.props.updateEducation(
                  index,
                  "courseName",
                  e.target.value
                )
              }
            />

            <input
              name="completionYear"
              placeholder="Completion Year"
              value={item.completionYear}
              onChange={(e) =>
                this.props.updateEducation(
                  index,
                  "completionYear",
                  e.target.value
                )
              }
            />

            <input
              name="college"
              placeholder="College"
              value={item.college}
              onChange={(e) =>
                this.props.updateEducation(
                  index,
                  "college",
                  e.target.value
                )
              }
            />

            <input
              name="percentage"
              placeholder="Percentage"
              value={item.percentage}
              onChange={(e) =>
                this.props.updateEducation(
                  index,
                  "percentage",
                  e.target.value
                )
              }
            />

            <button
              id="delete"
              className="delete-button"
              onClick={() =>
                this.props.deleteEducation(index)
              }
            >
              DELETE
            </button>

          </div>
        ))}

        <button
          id="add_education"
          className="add-button"
          onClick={this.props.addEducation}
        >
          ADD EDUCATION
        </button>

      </section>
    );
  }

  renderSkills() {
    const { skills } = this.props.resume;

    return (
      <section className="form-card">

        <h2>Add your Skills</h2>

        {skills.map((skill, index) => (
          <div className="skill-row" key={index}>

            <input
              name="skill"
              placeholder="Skill *"
              value={skill}
              onChange={(e) =>
                this.props.updateSkill(
                  index,
                  e.target.value
                )
              }
            />

            <button
              id="delete_skill"
              className="delete-button"
              onClick={() =>
                this.props.deleteSkill(index)
              }
            >
              DELETE SKILL
            </button>

          </div>
        ))}

        <button
          id="add_skill"
          className="add-button"
          onClick={this.props.addSkill}
        >
          ADD SKILL
        </button>

      </section>
    );
  }

  renderProjects() {
    const { projects } = this.props.resume;

    return (
      <section className="form-card">

        <h2>Add your Mini Projects</h2>

        {projects.map((project, index) => (
          <div className="project-row" key={index}>

            <input
              name="projectName"
              placeholder="Project Name *"
              value={project.projectName}
              onChange={(e) =>
                this.props.updateProject(
                  index,
                  "projectName",
                  e.target.value
                )
              }
            />

            <input
              name="techStack"
              placeholder="Tech Stack"
              value={project.techStack}
              onChange={(e) =>
                this.props.updateProject(
                  index,
                  "techStack",
                  e.target.value
                )
              }
            />

            <input
              name="description"
              placeholder="Description"
              value={project.description}
              onChange={(e) =>
                this.props.updateProject(
                  index,
                  "description",
                  e.target.value
                )
              }
            />

            <button
              id="delete"
              className="delete-button"
              onClick={() =>
                this.props.deleteProject(index)
              }
            >
              DELETE
            </button>

          </div>
        ))}

        <button
          id="add_project"
          className="add-button"
          onClick={this.props.addProject}
        >
          ADD PROJECT
        </button>

      </section>
    );
  }

  renderSocial() {
    const { social } = this.props.resume;

    return (
      <section className="form-card">

        <h2>
          Add social links like linkedin , github etc
        </h2>

        {social.map((item, index) => (
          <div className="social-row" key={index}>

            <input
              name="Social"
              placeholder="Social Links *"
              value={item}
              onChange={(e) =>
                this.props.updateSocial(
                  index,
                  e.target.value
                )
              }
            />

            <button
              className="delete-button"
              onClick={() =>
                this.props.deleteSocial(index)
              }
            >
              DELETE SOCIAL
            </button>

          </div>
        ))}

        <button
          id="add_social"
          className="add-button"
          onClick={this.props.addSocial}
        >
          ADD SOCIAL
        </button>

      </section>
    );
  }

  renderResume() {
    const {
      profile,
      education,
      skills,
      projects,
      social
    } = this.props.resume;

    return (
      <div className="resume-output">

        <h2>All steps completed - your resume is ready!!</h2>

        <div className="resume-actions">

          <button
            onClick={() => this.goToPage(1)}
          >
            RESET
          </button>

          <button
            onClick={() => this.goToPage(1)}
          >
            EDIT
          </button>

          <button
            onClick={() => window.print()}
            className="primary-button"
          >
            DOWNLOAD / PREVIEW
          </button>

        </div>

        <div className="resume-paper">

          <div className="resume-header">

            {profile.url && (
              <img
                src={profile.url}
                alt="Profile"
                className="resume-photo"
              />
            )}

            <div>
              <h1>
                {profile.fname || "Name"}{" "}
                {profile.lname || "Last"}
              </h1>

              <p>
                Address :{" "}
                {profile.address || "Somewhere"}
              </p>

              <p>
                Phone Number:{" "}
                {profile.phone || "2345678901"}
              </p>
            </div>

          </div>

          <div className="resume-body">

            <aside>

              <h2>Skills</h2>

              <ul>
                {skills
                  .filter((skill) => skill.trim() !== "")
                  .map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
              </ul>

            </aside>

            <main className="resume-main">

              <h2>Education</h2>

              {education
                .filter(
                  (item) =>
                    item.courseName ||
                    item.college
                )
                .map((item, index) => (
                  <div key={index} className="resume-entry">

                    <h3>
                      {item.college}
                    </h3>

                    <p>
                      {item.courseName}
                    </p>

                    <p>
                      Graduation Year :{" "}
                      {item.completionYear}
                    </p>

                    <p>
                      Percentage :{" "}
                      {item.percentage}
                    </p>

                  </div>
                ))}

              <h2>Mini Projects</h2>

              {projects
                .filter(
                  (project) =>
                    project.projectName
                )
                .map((project, index) => (
                  <div
                    key={index}
                    className="resume-entry"
                  >

                    <h3>
                      {project.projectName}
                    </h3>

                    <p>
                      {project.description}
                    </p>

                    <p>
                      Tech Stack :{" "}
                      {project.techStack}
                    </p>

                  </div>
                ))}

              <h2>Social Links</h2>

              <ul>
                {social
                  .filter((item) => item.trim() !== "")
                  .map((item, index) => (
                    <li key={index}>
                      <a
                        href={
                          item.startsWith("http")
                            ? item
                            : `https://${item}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
              </ul>

            </main>

          </div>

        </div>

      </div>
    );
  }

  render() {
    const { page } = this.props.resume;

    return (
      <div>

        <header className="header">
          <h1>RESUME GENERATOR</h1>
        </header>

        {this.renderStepper()}

        {page === 1 && this.renderProfile()}
        {page === 2 && this.renderEducation()}
        {page === 3 && this.renderSkills()}
        {page === 4 && this.renderProjects()}
        {page === 5 && this.renderSocial()}
        {page === 6 && this.renderResume()}

        {this.renderNavigation()}

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  resume: state
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (page) =>
    dispatch({
      type: "SET_PAGE",
      page: page
    }),

  updateProfile: (field, value) =>
    dispatch({
      type: "UPDATE_PROFILE",
      field: field,
      value: value
    }),

  updateEducation: (index, field, value) =>
    dispatch({
      type: "UPDATE_EDUCATION",
      index: index,
      field: field,
      value: value
    }),

  addEducation: () =>
    dispatch({
      type: "ADD_EDUCATION"
    }),

  deleteEducation: (index) =>
    dispatch({
      type: "DELETE_EDUCATION",
      index: index
    }),

  updateSkill: (index, value) =>
    dispatch({
      type: "UPDATE_SKILL",
      index: index,
      value: value
    }),

  addSkill: () =>
    dispatch({
      type: "ADD_SKILL"
    }),

  deleteSkill: (index) =>
    dispatch({
      type: "DELETE_SKILL",
      index: index
    }),

  updateProject: (index, field, value) =>
    dispatch({
      type: "UPDATE_PROJECT",
      index: index,
      field: field,
      value: value
    }),

  addProject: () =>
    dispatch({
      type: "ADD_PROJECT"
    }),

  deleteProject: (index) =>
    dispatch({
      type: "DELETE_PROJECT",
      index: index
    }),

  updateSocial: (index, value) =>
    dispatch({
      type: "UPDATE_SOCIAL",
      index: index,
      value: value
    }),

  addSocial: () =>
    dispatch({
      type: "ADD_SOCIAL"
    }),

  deleteSocial: (index) =>
    dispatch({
      type: "DELETE_SOCIAL",
      index: index
    })
});

const ConnectedResumeBuilder = connect(
  mapStateToProps,
  mapDispatchToProps
)(ResumeBuilder);

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedResumeBuilder />
    </Provider>
  );
};

export default App;
