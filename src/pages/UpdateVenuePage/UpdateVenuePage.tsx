import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import "./UpdateVenuePage.css";
import HomePageLayoutCards from "../../components/UI/HomePageLayoutCards/HomePageLayoutCards";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/UI/Modal/LoadingModal";
import Footer from "../../components/UI/Footer/Footer";
import useApi from "../../hooks/apiHook";
import { loadingActions } from "../../store/loading-store";
import { FileObj, uploadFilesToStorage } from "../../helpers/file-service";
import { v4 as uuidv4 } from "uuid";

const UpdateVenuePage = () => {
  const { createVenue } = useApi();
  const toBeUpdatedVenue = useLocation().state.venue;
  const venueOwner = useSelector((state: any) => state.venueOwner);
  toBeUpdatedVenue.details = JSON.parse(toBeUpdatedVenue.details);
  console.log(toBeUpdatedVenue);

  const [venue, setVenue] = useState<IVenue>({
    name: toBeUpdatedVenue.name,
    state: toBeUpdatedVenue.state,
    city: toBeUpdatedVenue.city,
    street: toBeUpdatedVenue.street,
    zipcode: toBeUpdatedVenue.zipcode,
    venueStatus: toBeUpdatedVenue.venueStatus,
    details: {
      description: toBeUpdatedVenue.details.description,
      price: toBeUpdatedVenue.details.price,
      venueNotes: toBeUpdatedVenue.details.venueNotes,
      eventOrganizer: venueOwner.first_name + " " + venueOwner.last_name,
    },
    venueType: toBeUpdatedVenue.venueType,
    images: toBeUpdatedVenue.images,
    Reservations: [],
    activities: [],
  });
  const [images, setImages] = useState<FileObj[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const submitHandler = async(e: any) => {
    e.preventDefault();
    dispatch(loadingActions.setLoading({ isLoading: true, message: "" }));
    const imageUrls = await uploadFilesToStorage(uuidv4(), images);
    createVenue({
      name: venue.name,
      state: venue.state,
      city: venue.city,
      street: venue.street,
      zipcode: venue.zipcode,
      details: JSON.stringify(venue.details),
      venueType: venue.venueType,
      images: [...venue.images,...(imageUrls || [])],
      venueStatus: venue.venueStatus,
    }).then((res) => {
      console.log(res);
    });

    dispatch(loadingActions.setLoading({ isLoading: false, message: "" }));
  };
  return (
    <>
      <h1
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Update {toBeUpdatedVenue?.name}
      </h1>
      {toBeUpdatedVenue ? (
        <div className="update-venue-page-container">
          <div
            className="back-btn"
            onClick={() => {
              navigate(-1);
            }}
          >
            <i className="bi bi-arrow-left-circle-fill" />
          </div>
          <HomePageLayoutCards width="40%" height="100%">
            <div className="update-venue-form">
              <form>
                <div className="form-control">
                  <label htmlFor="venue-name">Venue Name</label>
                  <input
                    type="text"
                    value={venue.name}
                    id="venue-name"
                    onChange={(e) => {
                      setVenue({ ...venue, name: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-state">State</label>
                  <input
                    type="text"
                    value={venue.state}
                    id="venue-state"
                    onChange={(e) => {
                      setVenue({ ...venue, state: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-city">City</label>
                  <input
                    type="text"
                    value={venue.city}
                    id="venue-city"
                    onChange={(e) => {
                      setVenue({ ...venue, city: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-street">Street</label>
                  <input
                    type="text"
                    id="venue-street"
                    value={venue.street}
                    onChange={(e) => {
                      setVenue({ ...venue, street: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-zipcode">Zipcode</label>
                  <input
                    type="text"
                    value={venue.zipcode}
                    id="venue-zipcode"
                    onChange={(e) => {
                      setVenue({ ...venue, zipcode: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-status">Venue Status</label>
                  <input
                    type="text"
                    value={venue.venueStatus}
                    id="venue-status"
                    onChange={(e) => {
                      setVenue({ ...venue, venueStatus: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-type">Venue Type</label>
                  <input
                    type="text"
                    value={venue.venueType}
                    id="venue-type"
                    onChange={(e) => {
                      setVenue({ ...venue, venueType: e.target.value });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-description">Venue Description</label>
                  <textarea
                    id="venue-description"
                    value={venue.details.description}
                    onChange={(e) => {
                      setVenue({
                        ...venue,
                        details: {
                          ...venue.details,
                          description: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-price">Venue Price</label>
                  <input
                    type="text"
                    id="venue-price"
                    value={venue.details.price}
                    onChange={(e) => {
                      setVenue({
                        ...venue,
                        details: { ...venue.details, price: e.target.value },
                      });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-notes">Venue Notes</label>
                  <textarea
                    id="venue-notes"
                    value={venue.details.venueNotes}
                    onChange={(e) => {
                      setVenue({
                        ...venue,
                        details: {
                          ...venue.details,
                          venueNotes: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-organizer">Event Organizer</label>
                  <input
                    type="text"
                    id="venue-organizer"
                    value={venueOwner.first_name + " " + venueOwner.last_name}
                    disabled
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="venue-images">Venue Images</label>
                  <input
                    type="file"
                    id="venue-images"
                    onChange={handleImageUpload}
                    // {(e) => {
                    //   const file = e.target.files?.[0];
                    //   if (file) {
                    //     const reader = new FileReader();
                    //     reader.onload = () => {
                    //       // create a hash of the image using bcrypt

                    //       setVenue({
                    //         ...venue,
                    //         images: [...venue.images, reader.result as string],
                    //       });
                    //     };
                    //     reader.readAsDataURL(file);
                    //   }
                    // }}
                  />
                </div>
                <button
                  type="submit"
                  onClick={submitHandler}
                  style={{
                    width: "100%",
                    margin: "1rem",
                  }}
                >
                  Update Venue
                </button>
              </form>
            </div>
          </HomePageLayoutCards>
          <HomePageLayoutCards width="40%" height="100%">
            <div className="venue-preview">
              <div className="venue-preview-content">
                <h2>Venue Preview</h2>
                <div className="venue-preview-images">
                  {venue.images.map((image, index) => (
                    <>
                      <div className="venue-preview-image">
                        <img key={index} src={image} alt="venue" />
                      </div>
                    </>
                  ))}
                </div>
                <div className="venue-preview-details">
                  <h3>{venue.name}</h3>
                  <p>{venue.state}</p>
                  <p>{venue.city}</p>
                  <p>{venue.street}</p>
                  <p>{venue.zipcode}</p>
                  <p>{venue.venueStatus}</p>
                  <p>{venue.venueType}</p>
                  <p>{venue.details.description}</p>
                  <p>{venue.details.price}</p>
                  <p>{venue.details.venueNotes}</p>
                  <p>{venue.details.eventOrganizer}</p>
                </div>
              </div>
            </div>
          </HomePageLayoutCards>
        </div>
      ) : (
        <h1>Invalid Venue</h1>
      )}
      <LoadingModal message="Updating Venue.." />
      <Footer />
    </>
  );
};

export default UpdateVenuePage;
