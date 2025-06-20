
import React, { useEffect, useState } from 'react';
import Axios from "axios";
import {useImmerReducer} from "use-immer";
import {useNavigate } from "react-router-dom";

//React Leaflet
import { 
  MapContainer,
  TileLayer, 
  Marker, 
  Popup,
  useMap, 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Icon } from "leaflet";

//MUI
import Grid from '@mui/material/Grid';
import RoomIcon from "@mui/icons-material/Room";
import {
   Typography, 
   Button, 
   Card, 
   CardHeader, 
   CardMedia, 
   CardContent, 
   CircularProgress, 
   IconButton,
  CardActions,
        } from '@mui/material';


//Map Icons
import houseIconPng from './Assets/Mapicons/house.png';
import apartmentIconPng from './Assets/Mapicons/apartment.png';
import officeIconPng from './Assets/Mapicons/office.png';

//Assets
import img1 from './Assets/img1.jpg';
import myListings from './Assets/Data/Dummydata';
import polygonOne from './Shape';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Listings() {

  const navigate = useNavigate();

  const houseIcon = new Icon({
    iconUrl: houseIconPng,
    iconSize: [40, 40],
  });
  const apartmentIcon = new Icon({
    iconUrl: apartmentIconPng,
    iconSize: [40, 40],
  });
  const officeIcon = new Icon({
    iconUrl: officeIconPng,
    iconSize: [40, 40],
  });

  const [latitude, setlatitude] = useState(19.0760);
  const [longitude, setlongitude] = useState(72.8777)

   const initialState = {
          mapInstance: null,
        
      };
  
  
      function ReducerFuction(draft, action) {
          switch (action.type) {
  
              case "getMap":
                  draft.mapInstance = action.mapData;
                  break;
  
              
  
          }
      }
  
      const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);
  
  
      function TheMapComponent() {
          const map = useMap();
          useEffect(() => {
              dispatch({
                  type: 'getMap',
                  mapData: map
              });
          }, [map]);
  
          return null;
      }
  


  const [allListings, setAllListings] = useState([])
  const [dataIsLoading, setDataIsLoading] = useState(true);


  useEffect(() => {
    const source = Axios.CancelToken.source();
    async function GetAllListings() {
      try {
        const response = await Axios.get(
          'http://127.0.0.1:8000/api/listings/',
          { CancelToken: source.token }
        )
        console.log("Fetched listings:", response.data);
        setAllListings(response.data);
        setDataIsLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error.message);
      }
    }
    GetAllListings();
    return () => {
      source.cancel();
    }
  }, []);

  if (dataIsLoading === false) {

    console.log(allListings);
  }

  if (dataIsLoading === true) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    )
  }

  return (
    <Grid container sx={{ height: '100vh' }}>
      {/* Left Panel - Scrollable */}
      <Grid
        size={{ xs: 6 }}
        sx={{
          bgcolor: '#f0f0f0',
          p: 2,
          height: '100vh',
          overflowY: 'auto', // Enable scrolling for left panel
          position: 'relative'
        }}
      >
        {allListings.map((listing) => {
          return (
            <Card
              key={listing.id}
              sx={{
                margin: "0.5rem",
                border: "1px solid black",
                position: "relative",
              }}>
              <CardHeader

                action={
                  <IconButton aria-label="settings" onClick={() => state.mapInstance.flyTo([listing.latitude, listing.longitude,25])}>
                    <RoomIcon />
                  </IconButton>
                }
                title={listing.title}
              />
              <CardMedia
                sx={{
                  paddingRight: "1rem",
                  paddingLeft: "1rem",
                  height: "20rem",
                  width: "30rem",
                  cursor: "pointer",
                }}
                component="img"

                image={listing.picture1}
                alt="liting.title"
                onClick={() => navigate(`/listings/${listing.id}`)}
              />
              <CardContent>
                <Typography variant="body2">
                  {listing.description.substring(0, 150)}...
                </Typography>
              </CardContent>

              {listing.property_status === "Sale" ? (
                <Typography
                  sx={{
                    position: "absolute",
                    backgroundColor: "green",
                    zIndex: "1000",
                    color: "white",
                    top: "100px",
                    left: "20px",
                    padding: "5px",
                  }}>
                  {listing.listing_type}:
                  ${listing.price.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </Typography>
              ) : (
                <Typography
                  sx={{
                    position: "absolute",
                    backgroundColor: "green",
                    zIndex: "1000",
                    color: "white",
                    top: "100px",
                    left: "20px",
                    padding: "5px",
                  }}>
                  {listing.listing_type}:
                  ${listing.price.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/ {listing.rental_frequency}
                </Typography>
              )}

              <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                {listing.seller_agency_name}
              </IconButton>
            </CardActions>
            </Card>
          )
        })}
      </Grid>

      {/* Right Panel - Fixed Map */}
      <Grid
        size={{ xs: 6 }}
        sx={{
          height: '100vh',
          position: 'sticky',
          top: 0,
          right: 0,
          marginTop: '0.5rem',
        }}
      >
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TheMapComponent />
          

          {myListings.map((listing) => {
            function iconDisplay() {
              if (listing.listing_type === 'Apartment') {
                return apartmentIcon;
              }
              else if (listing.listing_type === 'House') {
                return houseIcon;
              }
              else if (listing.listing_type === 'Office') {
                return officeIcon;
              }
            }

            const lat = parseFloat(listing.latitude);
            const lng = parseFloat(listing.longitude);

            if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
              console.warn("Skipping invalid marker:", listing);
              return null;
            }

            return (
              <Marker
                key={listing.id}
                icon={iconDisplay()}
                position={[
                  listing.latitude,
                  listing.longitude,
                ]}
              >
                <Popup>
                  <Typography variant="h5">{listing.title}</Typography>
                  <img src={listing.picture1} style={{ height: "14rem", width: '18rem' }} cursor= 'pointer' onClick={() => navigate(`/listings/${listing.id}`)} />
                  <Typography variant='body1'>{listing.description.substring(0, 150)}...</Typography>
                  <Button variant='contained' onClick={() => navigate(`/listings/${listing.id}`)}>Details</Button>
                </Popup>
              </Marker>
            )
          })}
          {/* <Marker icon={apartmentIcon} position={[latitude, longitude]}>
            
          </Marker> */}
        </MapContainer>
      </Grid>
    </Grid>
  );
}

export default Listings;