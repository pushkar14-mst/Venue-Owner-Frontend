import { useNavigate } from "react-router";
import "./CreateEventPage.css";
import HomePageLayoutCards from "../../components/UI/HomePageLayoutCards/HomePageLayoutCards";
import { useEffect, useState } from "react";
import { IEvent } from "../../IEvent";
import Footer from "../../components/UI/Footer/Footer";
import useApi from "../../hooks/apiHook";
import { loadingActions } from "../../store/loading-store";
import LoadingModal from "../../components/UI/Modal/LoadingModal";
import { useDispatch } from "react-redux";
import { FileObj, uploadFilesToStorage } from "../../helpers/file-service";
import { v4 as uuidv4 } from "uuid";

interface IVenueWithId extends IVenue {
  id: string;
}

const CreateEventPage = () => {
  const [event, setEvent] = useState<IEvent>({
    name: "",
    venueId: "",
    ageRange: "",
    cost: "",
    capacity: 0,
    activityStatus: "",
    startTime: "",
    endTime: "",
    images: [],
    coverImg: "",
    description: "",
  });
  const { getAllVenues, createEvent } = useApi();
  const [venues, setVenues] = useState<IVenueWithId[]>([]);
  const [images, setImages] = useState<FileObj[]>([]);
  const [coverImg, setCoverImg] = useState<FileObj[]>([]);
  useEffect(() => {
    getAllVenues().then((res) => {
      setVenues(res);
    });
  }, []);
  const venuesOptions = venues.map((venue: any) => (
    <option value={venue.venueId}>{venue.name}</option>
  ));
  // console.log(event);
  const eventStatusOptions = ["open", "sold out", "cancelled"];
  const navigate = useNavigate();
  const handleImageUpload = (e: any) => {
    const files = [...e.target.files].map(file => {
      return {
          file,
      }
  })
  setImages(
      [...images, ...files]
  )
  };

  const handleCoverImageUpload = (e: any) => {
    const files = [...e.target.files].map(file => {
      return {
          file,
      }
    })
    setCoverImg(
      [...coverImg, ...files]
    )
  }
  const dispatch = useDispatch();
  const submitHandler = async(e: any) => {
    e.preventDefault();
    if (
      event.activityStatus === "" ||
      event.ageRange === "" ||
      event.capacity === 0 ||
      event.cost === "" ||
      coverImg[0].file.name === "" ||
      event.description === "" ||
      event.endTime === "" ||
      images.length === 0 ||
      event.name === "" ||
      event.startTime === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    dispatch(loadingActions.setLoading({ isLoading: true, message: "" }));
    const id = uuidv4();
    const imageUrls = await uploadFilesToStorage(id, images);
    const coverImgUrl = await uploadFilesToStorage(id, coverImg);
    createEvent({
      ...event,
      images: imageUrls,
      coverImg: (coverImgUrl && coverImgUrl.length>0 ? coverImgUrl[0] : ''),
    }).then((res) => {
      console.log(res);
      setEvent({
        name: "",
        venueId: "",
        ageRange: "",
        cost: "",
        capacity: 0,
        activityStatus: "",
        startTime: "",
        endTime: "",
        images: [],
        coverImg: "",
        description: "",
      });
    });
  };
  return (
    <>
      {venues.length > 0 ? (
        <div className="create-event-page-container">
          <div
            className="back-btn"
            onClick={() => {
              navigate(-1);
            }}
          >
            <i className="bi bi-arrow-left-circle-fill" />
          </div>
          {/* <div className="create-event-form"></div> */}
          <HomePageLayoutCards width="40%" height="100%">
            <div className="create-event-form">
              <form>
                <h2>Create Event</h2>
                <div className="form-group">
                  <label htmlFor="coverImage">Cover Image</label>
                  <input
                    type="file"
                    id="coverImage"
                    onChange={handleCoverImageUpload}
                    // {(e) => {
                    //   const file = e.target.files?.[0];
                    //   if (file) {
                    //     const reader = new FileReader();
                    //     reader.onload = () => {
                    //       // create a hash of the image using bcrypt
                    //       setEvent({
                    //         ...event,
                    //         coverImg: reader.result as string,
                    //       });
                    //     };
                    //     reader.readAsDataURL(file);
                    //   }
                    // }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Event Name</label>
                  <input
                    type="text"
                    id="name"
                    value={event.name}
                    onChange={(e) =>
                      setEvent({ ...event, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="event-description">Venue Description</label>
                  <textarea
                    id="event-description"
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        description: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="venueId">Venue</label>
                  <select
                    name="venueId"
                    id="venueId"
                    onChange={(e) => {
                      let venueId = venues.find((venue) => {
                        return venue.name === e.target.value;
                      })?.id;

                      setEvent({ ...event, venueId: venueId });
                    }}
                  >
                    <option value="">Select Venue</option>
                    {venuesOptions}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="ageRange">Age Range</label>
                  <input
                    type="text"
                    id="ageRange"
                    value={event.ageRange}
                    onChange={(e) =>
                      setEvent({ ...event, ageRange: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cost">Cost</label>
                  <input
                    type="text"
                    id="cost"
                    value={event.cost}
                    onChange={(e) => {
                      setEvent({
                        ...event,
                        cost: parseFloat(e.target.value).toFixed(2),
                      });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="capacity">Capacity</label>
                  <input
                    type="number"
                    id="capacity"
                    value={event.capacity}
                    onChange={(e) =>
                      setEvent({ ...event, capacity: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="activityStatus">Activity Status</label>
                  <select
                    name="activityStatus"
                    id="activityStatus"
                    onChange={(e) =>
                      setEvent({ ...event, activityStatus: e.target.value })
                    }
                  >
                    <option value="">Select Status</option>
                    {eventStatusOptions.map((status) => (
                      <option value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="startTime">Start Time</label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    value={event.startTime}
                    onChange={(e) => {
                      console.log(e.target.value);

                      setEvent({ ...event, startTime: e.target.value });
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endTime">End Time</label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    value={event.endTime}
                    onChange={(e) =>
                      setEvent({ ...event, endTime: e.target.value })
                    }
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="venue-images">Venue Images</label>
                  <input
                    type="file"
                    id="venue-images"
                    onChange= {handleImageUpload}
                    // {(e) => {
                    //   const file = e.target.files?.[0];
                    //   if (file) {
                    //     const reader = new FileReader();
                    //     reader.onload = () => {
                    //       // create a hash of the image using bcrypt
                    //       setEvent({
                    //         ...event,
                    //         images: [...event.images, reader.result as string],
                    //       });
                    //     };
                    //     reader.readAsDataURL(file);
                    //   }
                    // }}
                  />
                </div>
                <button type="submit" onClick={submitHandler}>
                  Create Event
                </button>
              </form>
            </div>
          </HomePageLayoutCards>
          <HomePageLayoutCards width="40%" height="100%">
            <div className="event-preview">
              <h2>Event Preview</h2>

              <div className="event-preview-content">
                <div className="event-preview-cover">
                  <img src={event.coverImg} alt="event" />
                </div>
                <div className="event-preview-images">
                  {event.images.map((image, index) => (
                    <>
                      <div className="event-preview-image">
                        <img key={index} src={image} alt="event" />
                      </div>
                    </>
                  ))}
                </div>
                <div className="event-preview-details">
                  <h3>{event.name}</h3>
                  <p>Age Range: {event.ageRange}</p>
                  <p>Cost: {event.cost}</p>
                  <p>Capacity: {event.capacity}</p>
                  <p>Activity Status: {event.activityStatus}</p>
                  <p>Start Time: {event.startTime}</p>
                  <p>End Time: {event.endTime}</p>
                </div>
              </div>
            </div>
          </HomePageLayoutCards>
        </div>
      ) : (
        <h1>Please add atleast one venue for adding an event.</h1>
      )}
      <LoadingModal message="Creating Event" />
      <Footer />
    </>
  );
};
export default CreateEventPage;
