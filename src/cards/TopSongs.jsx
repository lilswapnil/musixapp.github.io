
export default function TopSongs() {
  // Use the dummy data for now until the API data is loaded
  const items = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    song: `Song ${index + 1}`,
    artist: `Artist ${index + 1}`
  }));

  // Split items into groups of 5
  const groupedItems = [];
  for (let i = 0; i < items.length; i += 4) {
    groupedItems.push(items.slice(i, i + 4));
  }

  return (
    <div className='section-container'>
      <div className="section-heading">
        <div className="section-title">Top Songs</div>
      </div>
      <div className="grid-scroll-container">
        {groupedItems.map((group, groupIndex) => (
          <div key={groupIndex} className="section-group">
            {group.map((item) => (
              <div key={item.id} className="section-content-container">
                <div className="content-image">
                  <img src="album-art.jpg" alt="" />
                </div>
                <div className="content-information">
                  <div className="content-song">{item.song}</div>
                  <div className="content-artist">{item.artist}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
