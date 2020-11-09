import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hook'
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'


const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState()
  const {isLoading, error, sendRequest, clearError } = useHttpClient()

  const userId = useParams().userId;
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
          )
        setLoadedPlaces(responseData.places)
      } catch(err) {
        console.log(err);
      }
    }
    fetchPlaces()
  }, [sendRequest, userId])
  
  const placeDeleteHandler = (deletedPlaceId) => {
    // return a new array of setLoadedPlaces with filtered out the current deletedPlace
    setLoadedPlaces(prevPlaces => prevPlaces.filter(places => places.id !== deletedPlaceId))
  }

  // const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);
  return (
    <>
      {/* <ErrorModal error={error} onClear={clearError} /> */}
      {isLoading && (
        <LoadingSpinner asOverlay />
     )}
      {!isLoading && loadedPlaces &&
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeleteHandler} />
      }
    </>
  )
};

export default UserPlaces;
