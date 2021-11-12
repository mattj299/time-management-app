import React, { useEffect, useState } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

import "./styles.scss";

// data set up as arrays in array
// ex. const intitialState = {
//  labels: [ [], [] ],
// hours: [ [], [] ]
// }

const INITIAL_DATA_STATE = {
  labels: [
    [
      "Wake up",
      "Eat Breakfast",
      "Study",
      "Gym",
      "Shower",
      "Lunch",
      "Study",
      "Eat",
      "Study",
      "Eat",
      "Sleep",
    ],
    ["Wake up", "Eat Breakfast", "Lunch", "Dinner"],
  ],
  hours: [
    [
      "07:00",
      "07:30",
      "08:00",
      "10:00",
      "12:00",
      "12:15",
      "13:00",
      "15:30",
      "16:00",
      "19:00",
      "22:30",
    ],
    ["10:00", "10:30", "15:00", "19:30"],
  ],

  indexOfActiveDataset: 0,
};

function TimelineAndForm() {
  const [data, setData] = useState({ ...INITIAL_DATA_STATE });

  // call localStorage to get data and set to state
  useEffect(() => {
    const localData = localStorage.getItem("data");

    if (localData) {
      setData(JSON.parse(localData));
    }
  }, []);

  // states so user can minimize to make it more compact without scrolling to see everything or completely hide timeline, adds and removes classes for effect
  const [minimize, setMinimize] = useState(false);
  const [hide, setHide] = useState(false);

  // index of the active dataset in order to display correct data based on what dataset is chosen
  const indexOfActiveDataset = data.indexOfActiveDataset;

  const minimizeTimeline = () => {
    setHide(false);
    setMinimize(!minimize);
  };

  const hideTimeline = () => {
    setMinimize(false);
    setHide(!hide);
  };

  return (
    <div className="timeline-and-form">
      <div className="timeline-container">
        {hide ? (
          <>
            <p>Hidden...</p>
          </>
        ) : (
          <>
            <Timeline className="timeline" position="alternate">
              {data &&
                data.labels[indexOfActiveDataset].map((dataItem, index) => {
                  // removes connector if it is the final item
                  const finalItem =
                    data.labels[indexOfActiveDataset].length - 1 === index;

                  // if true the time is AM, false PM, displays accordingly
                  let AMtruePMfalse = true;

                  // hour turned into an integer so it can be subtracted by 12 if time is above or equal to 13:00 (ie. 1pm, 7pm, etc)
                  let hourInt = parseInt(
                    data.hours[indexOfActiveDataset][index]
                  );

                  // set hour to hour data and grabs minutes from the hour to display on the timeline
                  const hour = data.hours[indexOfActiveDataset][index];
                  const minutesTens = hour.charAt(hour.length - 2);
                  const minutesOnes = hour.charAt(hour.length - 1);

                  // if 12 (12pm) switch from am to pm
                  if (hourInt === 12) {
                    AMtruePMfalse = false;
                  }

                  // if 0 (12am) hourtInt is 12 and still am
                  if (hourInt === 0) {
                    hourInt = 12;
                  }

                  // if above or equal to 13 then subtract 12 to use normal time and not military time (ie 13 = 1pm)
                  if (hourInt >= 13) {
                    AMtruePMfalse = false;
                    hourInt -= 12;
                  }

                  let timelineDotColor = "";

                  if (index % 2 === 0) {
                    timelineDotColor = "primary";
                  } else {
                    timelineDotColor = "secondary";
                  }

                  return (
                    <TimelineItem
                      className={
                        minimize
                          ? "timeline-item minimize-timeline"
                          : "timeline-item"
                      }
                      key={index}
                    >
                      <TimelineOppositeContent className="timeline-opposite-content">
                        {hourInt}:{minutesTens}
                        {minutesOnes} {AMtruePMfalse ? "AM" : "PM"}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          color={timelineDotColor}
                          variant="outlined"
                        />
                        {!finalItem && <TimelineConnector />}
                      </TimelineSeparator>
                      <TimelineContent className="timeline-content">
                        {data.labels[indexOfActiveDataset][index]}
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
            </Timeline>
          </>
        )}

        <p className="timeline-extras">
          <span
            className="timeline-extra extra-minimize"
            onClick={minimizeTimeline}
          >
            {minimize ? "Expand" : "Minimize"}
          </span>
          |
          <span className="timeline-extra extra-hide" onClick={hideTimeline}>
            {hide ? "Display" : "Hide"}
          </span>
        </p>
      </div>

      <Form data={data} setData={setData} />

      <CustomizeDataColor />
    </div>
  );
}

const INITIAL_PRESET_STATE = {
  presetNames: ["Preset 1", "Preset 2"],
  changePresetName: false,
  indexOfNameChanging: 0,
  inputNameChangeValue: "",
};

function Form({ data, setData }) {
  // index of the active dataset in order to display correct data based on what dataset is chosen
  const indexOfActiveDataset = data.indexOfActiveDataset;

  // states so user can minimize to make it more compact without scrolling to see everything or completely hide form, adds and removes classes for effect
  const [minimize, setMinimize] = useState(false);
  const [hide, setHide] = useState(false);

  // preset names, user can change preset names by double clicking on preset buttons (changePresetName becomes true)
  const [presetNames, setPresetNames] = useState(INITIAL_PRESET_STATE);

  // gets localStorage and sets presetNames
  useEffect(() => {
    const localPresetData = localStorage.getItem("presetData");

    const parsedData = JSON.parse(localPresetData);

    if (localPresetData) {
      setPresetNames({
        ...parsedData,
      });
    }
  }, []);

  // ensures indexOfActiveDataset is always the data with preset-active class
  useEffect(() => {
    // if there is a currently active preset remove class preset-active and add it to first element with class timeline-preset to correspond with reseting presets
    const currentlyActivePreset =
      document.getElementsByClassName("preset-active")[0];
    if (currentlyActivePreset)
      currentlyActivePreset.classList.remove("preset-active");

    const activePreset =
      document.getElementsByClassName("timeline-preset")[indexOfActiveDataset];
    activePreset.classList.add("preset-active");
  }, [data.indexOfActiveDataset]);

  // function which toggles states to either hide, display, minimize, or expand form
  const minimizeForm = () => {
    // useEffect changes class to first preset so this calls setData to change data from form to first preset whenever toggling minimize
    setData({
      ...data,
      indexOfActiveDataset: 0,
    });
    setHide(false);
    setMinimize(!minimize);
  };

  const hideForm = () => {
    if (hide) {
      // useEffect changes class to first preset so this calls setData to change data from form to first preset only when hide is true
      setData({
        ...data,
        indexOfActiveDataset: 0,
      });
    }
    setMinimize(false);
    setHide(!hide);
  };

  // changes localStorage to whatever new values indicated in parameter. This gets called after every function it's needed as oppose to localStorage.setItem
  const changesToLocalStorage = (data, presetData) => {
    // resets localStorage to original data if data existed. If no data existed then add data
    localStorage.setItem("data", JSON.stringify({ ...data }));
    localStorage.setItem("presetData", JSON.stringify({ ...presetData }));
  };

  // gives preset that is clicked on the preset-active class
  const activePreset = (e, index) => {
    const currentlyActive = document.getElementsByClassName("preset-active")[0];
    // if currentlyActive doesn't exist end function
    if (currentlyActive) currentlyActive.classList.remove("preset-active");

    const newActive = e.target;
    // if newActive doesn't exist end function
    if (newActive) newActive.classList.add("preset-active");

    // get index of item and set to indexOfActiveDataset to state of TimelineAndForm
    setData({ ...data, indexOfActiveDataset: index });
  };

  const onPresetNameDoubleClick = (e, index) => {
    setPresetNames({
      ...presetNames,
      changePresetName: true,
      indexOfNameChanging: index,
      inputNameChangeValue: presetNames.presetNames[index],
    });
  };

  // runs when submitting input for preset name change
  const onPresetNameChangeSubmit = (e) => {
    // accesses state
    const indexOfNameChanging = presetNames.indexOfNameChanging;
    const inputNameChangeValue = presetNames.inputNameChangeValue;

    // maps through state and checks if index matches index of one that's going to change, if matches change to new value otherwise return old value
    const newPresetNames = presetNames.presetNames.map((presetName, index) => {
      return index === indexOfNameChanging ? inputNameChangeValue : presetName;
    });

    // sets state to old state, updates presetNames and sets changePresetName to false to get rid of input
    setPresetNames({
      ...presetNames,
      presetNames: newPresetNames,
      changePresetName: false,
      inputNameChangeValue: "",
    });

    changesToLocalStorage(
      { ...data, indexOfActiveDataset: 0 },
      {
        ...presetNames,
        presetNames: newPresetNames,
        changePresetName: false,
        inputNameChangeValue: "",
      }
    );
  };

  // closes input to change preset name
  const onPresetNameClose = () => {
    setPresetNames({ ...presetNames, changePresetName: false });
  };

  // change text in input for input name change
  const onPresetNameChange = (e) => {
    setPresetNames({ ...presetNames, [e.target.name]: e.target.value });
  };

  const closeRenameMessage = () => {
    setPresetNames({ ...presetNames });
  };

  const closeSaveMessage = () => {
    setPresetNames({ ...presetNames });
  };

  const addPreset = (e) => {
    // add new preset name to presetNames and update presetNames
    const presetsLength = presetNames.presetNames.length + 1;

    // user can only have 10 presets. Implemented in case user spams to create new presets
    if (presetsLength > 10) {
      toastifyNotification("Can only have a max of 10 presets!");
      return;
    }

    const newPresetName = "Preset " + presetsLength;
    const newPresets = [...presetNames.presetNames];
    newPresets.push(newPresetName);

    // add new data to TimelineAndForm for new preset name
    const newLabels = [...data.labels];
    const newHours = [...data.hours];

    newLabels.push(["Wake Up"]);
    newHours.push(["08:00"]);

    toastifyNotification("New Preset Added!");

    setData({ ...data, labels: newLabels, hours: newHours });
    setPresetNames({ ...presetNames, presetNames: newPresets });

    changesToLocalStorage(
      { indexOfActiveDataset: 0, labels: newLabels, hours: newHours },
      { ...presetNames, presetNames: newPresets }
    );
  };

  const removeActivePreset = (e, index) => {
    if (data.labels.length === 1) return;

    let confirmReset = window.confirm(
      "Are you sure you want to remove this preset?"
    );
    if (!confirmReset) return;

    toastifyNotification("Remove was Successful!");

    // fitlers out the preset
    const newPresetNames = presetNames.presetNames.filter((name, nameIndex) => {
      return nameIndex != index;
    });

    const newLabels = [...data.labels];
    const newHours = [...data.hours];

    newLabels.splice(index, 1);
    newHours.splice(index, 1);

    setData({ indexOfActiveDataset: 0, labels: newLabels, hours: newHours });
    setPresetNames({ ...presetNames, presetNames: newPresetNames });

    changesToLocalStorage(
      { indexOfActiveDataset: 0, labels: newLabels, hours: newHours },
      { ...presetNames, presetNames: newPresetNames }
    );
  };

  const resetPresets = (e) => {
    let confirmReset = window.confirm(
      "Are you sure you want to reset all of the presets?"
    );

    if (!confirmReset) return;

    toastifyNotification("Reset was Successful!");

    setData({ ...INITIAL_DATA_STATE });
    setPresetNames({
      ...INITIAL_PRESET_STATE,
    });

    changesToLocalStorage(
      { ...INITIAL_DATA_STATE },
      { ...INITIAL_PRESET_STATE }
    );
  };

  // toastify notification
  const toastifyNotification = (notificationText) => {
    toast(notificationText, {
      theme: "dark",
      autoClose: 2000,
    });

    // removes toast queue if exists
    toast.clearWaitingQueue();
  };

  const onActivitiesChange = (e, index) => {
    const newValue = e.target.value;
    const name = e.target.name;

    if (name === "label") {
      // maps and returns everything as normal except when new indexOfItem matches index of the array changing then return the new newDataArray
      const newData = data.labels[indexOfActiveDataset].map(
        (dataItem, indexOfItem) => {
          return indexOfItem === index ? newValue : dataItem;
        }
      );

      const newLabels = data.labels.map((labels, index) => {
        if (index == indexOfActiveDataset) return newData;
        else return labels;
      });

      // sets new labels
      setData({ ...data, labels: newLabels });

      changesToLocalStorage(
        { ...data, indexOfActiveDataset: 0, labels: newLabels },
        { ...presetNames }
      );
    } else {
      // maps and returns everything as normal except when new indexOfItem matches index of the array changing then return the new newDataArray
      const newData = data.hours[indexOfActiveDataset].map(
        (dataItem, indexOfItem) => {
          return indexOfItem === index ? newValue : dataItem;
        }
      );

      const newHours = data.hours.map((hours, index) => {
        if (index == indexOfActiveDataset) return newData;
        else return hours;
      });

      // sets new labels
      setData({ ...data, hours: newHours });

      changesToLocalStorage(
        { ...data, indexOfActiveDataset: 0, hours: newHours },
        { ...presetNames }
      );
    }
  };

  const addActivity = (e) => {
    // copying currently active data and adding new element to data
    const newLabels = [...data.labels[indexOfActiveDataset]];
    const newHours = [...data.hours[indexOfActiveDataset]];

    newLabels.push("New Activity");
    newHours.push("00:00");

    // if index matches indexOfActiveDataset in state then return new data else return old
    const updatedLabels = data.labels.map((labels, index) => {
      if (index == indexOfActiveDataset) return newLabels;
      return labels;
    });

    const updatedHours = data.hours.map((hours, index) => {
      if (index == indexOfActiveDataset) return newHours;
      return hours;
    });

    // update dataset
    setData({ ...data, labels: updatedLabels, hours: updatedHours });

    changesToLocalStorage(
      { indexOfActiveDataset: 0, labels: updatedLabels, hours: updatedHours },
      { ...presetNames }
    );
  };

  const removeSpecificActivity = (e, index) => {
    if (data.labels.length === 1) {
      return;
    }
    // labels and hours
    const labels = [...data.labels];
    const hours = [...data.hours];

    // when clicked access closest svg then get parent of it to receive array of children nodes which are the inputs we want to access
    const closestSvg = e.target.closest("div");
    const formInputRow = closestSvg.parentNode;
    const formInputRowChildern = formInputRow.children;
    // values of the inputs we want to access
    const formLabelValue = formInputRowChildern[0].value;
    const formHourValue = formInputRowChildern[1].value;

    // gets new data from inputs and filters out from array
    const newLabels = labels[indexOfActiveDataset].filter((label, index) => {
      const currentLabel = labels[indexOfActiveDataset][index];
      const currentHour = hours[indexOfActiveDataset][index];
      if (currentLabel == formLabelValue && currentHour == formHourValue) {
        return false;
      }
      return true;
    });

    // gets new data from inputs and filters out from array
    const newHours = hours[indexOfActiveDataset].filter((hour, index) => {
      const currentLabel = labels[indexOfActiveDataset][index];
      const currentHour = hours[indexOfActiveDataset][index];
      if (currentLabel == formLabelValue && currentHour == formHourValue) {
        return false;
      }
      return true;
    });

    // if index matches indexOfActiveDataset in state then return new data else return old
    const updatedLabels = data.labels.map((labels, index) => {
      if (index == indexOfActiveDataset) return newLabels;
      return labels;
    });

    const updatedHours = data.hours.map((hours, index) => {
      if (index == indexOfActiveDataset) return newHours;
      return hours;
    });

    // // set form data to new arrays
    setData({ ...data, labels: updatedLabels, hours: updatedHours });

    changesToLocalStorage(
      { indexOfActiveDataset: 0, labels: updatedLabels, hours: updatedHours },
      { ...presetNames }
    );
  };

  const resetActivites = () => {
    // new dataset to update to
    const updatedLabels = ["New Activity"];
    const updatedHours = ["00:00"];

    // if label and hour matches the one reseting and are in the same index then update array item. return as normal for the rest
    const newLabels = data.labels.map((label, index) => {
      if (index == indexOfActiveDataset) return updatedLabels;
      return label;
    });

    const newHours = data.hours.map((hours, index) => {
      if (index == indexOfActiveDataset) return updatedHours;
      return hours;
    });

    setData({ ...data, labels: newLabels, hours: newHours });

    changesToLocalStorage(
      { indexOfActiveDataset: 0, labels: newLabels, hours: newHours },
      { ...presetNames }
    );
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    toastifyNotification("Submitted Updates!");

    changesToLocalStorage(
      { ...data, indexOfActiveDataset: 0 },
      { ...presetNames }
    );
    return;
  };

  return (
    <>
      <div className="timeline-form-form-container">
        <form onSubmit={onFormSubmit} className="timeline-form-form">
          {hide ? (
            <p>Hidden...</p>
          ) : (
            <>
              <div className="timeline-preset-content-container">
                <div className="timeline-presets">
                  {presetNames.presetNames.map((preset, index) => {
                    // adds preset-active class only if first item of array, else don't add to class list
                    let presetActiveFirstItem = true;

                    if (index != 0) {
                      presetActiveFirstItem = false;
                    }

                    return (
                      <div className="timeline-preset-div" key={index}>
                        <Tippy
                          content="Double click to change preset name"
                          className="timeline-preset-div-tippy"
                          arrow={false}
                        >
                          <p
                            className={`${
                              minimize
                                ? "timeline-preset minimize-form-preset"
                                : "timeline-preset"
                            } ${presetActiveFirstItem ? "preset-active" : ""}`}
                            onClick={(e, ind) => {
                              activePreset(e, index);
                            }}
                            onDoubleClick={(e, ind) => {
                              onPresetNameDoubleClick(e, index);
                            }}
                            name={preset}
                          >
                            {preset}
                          </p>
                        </Tippy>
                      </div>
                    );
                  })}
                </div>

                {presetNames.changePresetName && (
                  <div className="timeline-presets-name-change-container">
                    <input
                      autoComplete="off"
                      type="text"
                      name="inputNameChangeValue"
                      value={presetNames.inputNameChangeValue}
                      className="timeline-preset-name-change-input"
                      name="inputNameChangeValue"
                      placeholder="Max characters 10"
                      maxLength="10"
                      onChange={onPresetNameChange}
                      // runs function if enter is clicked. Does nothing if clicked enter without this line
                      onKeyPress={(e) => {
                        e.key === "Enter" && onPresetNameChangeSubmit();
                      }}
                    />

                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <AiOutlineCheck
                        onClick={onPresetNameChangeSubmit}
                        className="timeline-preset-name-change-submit timeline-preset-name-change-button"
                      />
                      <AiOutlineClose
                        onClick={onPresetNameClose}
                        className="timeline-preset-name-change-delete timeline-preset-name-change-button"
                      />
                    </div>
                  </div>
                )}

                <div className="timeline-presets-buttons">
                  <button
                    className={
                      minimize
                        ? "timeline-preset-button minimize-timeline-preset-buttons"
                        : "timeline-preset-button"
                    }
                    type="button"
                    onClick={(e) => {
                      addPreset(e);
                    }}
                  >
                    ADD PRESET
                  </button>

                  <div style={{ display: "flex" }}>
                    <button
                      className={
                        minimize
                          ? "timeline-preset-button minimize-timeline-preset-buttons"
                          : "timeline-preset-button"
                      }
                      type="button"
                      onClick={(e) => resetPresets(e)}
                    >
                      RESET PRESETS
                    </button>

                    <button
                      className={
                        minimize
                          ? "timeline-preset-button minimize-timeline-preset-buttons"
                          : "timeline-preset-button"
                      }
                      type="button"
                      onClick={(e) =>
                        removeActivePreset(e, indexOfActiveDataset)
                      }
                    >
                      REMOVE ACTIVE
                    </button>
                  </div>
                </div>
              </div>

              <div className="timeline-form-inputs-container">
                <div
                  className="timeline-form-inputs"
                  style={
                    minimize ? { marginTop: "5px" } : { marginTop: "10px" }
                  }
                >
                  {data.labels[indexOfActiveDataset].map((label, index) => {
                    return (
                      <div
                        className={
                          minimize
                            ? "form-inputs-row minimize-form"
                            : "form-inputs-row"
                        }
                        key={index}
                      >
                        <input
                          className={
                            minimize
                              ? "timeline-form-input form-label minimize-form"
                              : "timeline-form-input form-label"
                          }
                          value={data.labels[indexOfActiveDataset][index]}
                          name="label"
                          type="text"
                          autoComplete="off"
                          onChange={(e) => onActivitiesChange(e, index)}
                          required
                          // stops user from clicking enter on input. If removed creates new preset for whatever reason
                          onKeyPress={(e) => {
                            e.key === "Enter" && onFormSubmit(e);
                          }}
                        />

                        <input
                          className={
                            minimize
                              ? "timeline-form-input form-hour minimize-form"
                              : "timeline-form-input form-hour"
                          }
                          value={data.hours[indexOfActiveDataset][index]}
                          name="hour"
                          type="time"
                          onChange={(e) => onActivitiesChange(e, index)}
                          required
                          // stops user from clicking enter on input. If removed creates new preset for whatever reason
                          onKeyPress={(e) => {
                            e.key === "Enter" && onFormSubmit(e);
                          }}
                        />

                        <div
                          className="form-delete"
                          onClick={(e) => {
                            toastifyNotification("Remove was Successful!");
                            removeSpecificActivity(e, index);
                          }}
                        >
                          x
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-buttons">
                <ToastContainer limit="3" />

                <div className="form-extra-buttons">
                  <button
                    type="submit"
                    className={
                      minimize
                        ? "form-button minimize-form-button"
                        : "form-button"
                    }
                  >
                    SUBMIT ACTIVITIES
                  </button>
                  <div style={{ display: "flex" }}>
                    <button
                      className={
                        minimize
                          ? "form-button minimize-form-button"
                          : "form-button"
                      }
                      type="button"
                      onClick={() => {
                        toastifyNotification("New Activity Added!");
                        addActivity();
                      }}
                    >
                      ADD ACTIVITY
                    </button>

                    <button
                      className={
                        minimize
                          ? "form-button minimize-form-button"
                          : "form-button"
                      }
                      type="button"
                      onClick={() => {
                        toastifyNotification("Reset was Successful!");
                        resetActivites();
                      }}
                    >
                      RESET ACTIVITIES
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        <p className="form-extras">
          <span
            className="form-extra extra-form-minimize"
            onClick={minimizeForm}
          >
            {minimize ? "Expand" : "Minimize"}
          </span>
          |
          <span className="form-extra extra-form-hide" onClick={hideForm}>
            {hide ? "Display" : "Hide"}
          </span>
        </p>
      </div>
    </>
  );
}

// function to customize colors, because i can
function CustomizeDataColor({}) {
  return (
    <div>
      <div></div>
    </div>
  );
}

export default TimelineAndForm;
