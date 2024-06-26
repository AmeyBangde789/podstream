import styled from 'styled-components';
import PodcastCard from './PodcastCard';
import Playlists from './Playlists';
import useGetUploadData from '../../hooks/useGetUploadData'

const DashboardMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 786px) {
    padding: 6px 10px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`;

const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  text-transform: capitalize;
  align-items: center;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  justify-content: center;
  @media (max-width: 550px) {
    justify-content: center;
  }
`;

const ErrorText = styled.div`
color: ${({ theme }) => theme.text_primary}; 
height: 60vh;
`

const PodcastCards = ({ feedType, userId, query }) => {

  const getPostEndPoint = () => {
    switch (feedType) {
      case "":
        return `/api/upload/all`;
      case "videos":
        return `/api/upload/userpod/${userId}`;
      case "saved":
        return `/api/upload/getsaved/${userId}`;
      case "liked":
        return `/api/upload/likedpod/${userId}`;
      case "playlists":
        return `/api/upload/playlists/${userId}`;
      case "favorites":
        return `/api/upload/getsaved/${userId}`;
      case "search":
        return `/api/upload/search/${query}`;
      case `${feedType}`:
        return `/api/upload/category/${feedType}`;
      default:
        return "/api/upload/all"
    }
  }

  const POST_ENDPOINTS = getPostEndPoint();

  const { uploads,isError } = useGetUploadData(POST_ENDPOINTS, feedType, userId,query);

  const isUploadsArray = Array.isArray(uploads);

  return (
    <DashboardMain>
      <Topic>
        {feedType === undefined ? "For you" : feedType}
      </Topic>
      <FilterContainer>

        {feedType !== "playlists" && <Podcasts>
          {!isUploadsArray || uploads.length === 0 || isError ? (
            <ErrorText className='text-center my-4'>No podcasts in this tab. Switch 👻</ErrorText>
          ) : (
            <div className='flex gap-4 flex-wrap justify-center'>
              {uploads.map((upload) => (
                <PodcastCard key={upload._id} upload={upload} />
              ))}
            </div>
          )}
        </Podcasts>}
        

        {feedType === "playlists" && <Podcasts>
          {!isUploadsArray || uploads.length === 0  ? (
            <ErrorText className='text-center my-4'>No podcasts in this tab. Switch 👻</ErrorText>
          ) : (
            <div className='flex gap-4 flex-wrap justify-center'>
              {uploads.map((upload) => (
                <Playlists upload={upload} />
              ))}
            </div>
          )}
        </Podcasts>}

      </FilterContainer>
    </DashboardMain>
  );
};

export default PodcastCards;
