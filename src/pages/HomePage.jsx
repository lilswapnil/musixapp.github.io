import Discover from "../cards/Discover";
import RecentSearch from "../cards/RecentSearch";
import TopAlbums from "../cards/TopAlbums";
import TopSongs from "../cards/TopSongs";
export default function HomePage() {

  return (
    <>
    <Discover />
    <RecentSearch />
    <TopSongs />
    <TopAlbums />
    </>
  );
};
