import React from "react";

const UserPhotos = ({ posts }: { posts: [any] }) => {
  console.log(posts);
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <div className="flex w-full justify-between py-2">
          <div>Photos</div>
          <span className="text-primary">See All Photos</span>
        </div>
        <div className="carousel carousel-center rounded-box">
          {posts
            ? posts.map((item) => {
                const { posts, user } = item;
                if (posts) {
                  const { image } = posts;
                  if (!image) return null;
                  return (
                    <div className="carousel-item" key={posts.postId}>
                      <img className="" src={image} alt="Pizza" height={300} width={300} />
                    </div>
                  );
                }
              })
            : []}
        </div>
      </div>
    </div>
  );
};

export default UserPhotos;
