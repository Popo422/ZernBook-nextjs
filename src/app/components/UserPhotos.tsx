import React from "react";

const UserPhotos = () => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <div className="flex w-full justify-between py-2">
          <div>Photos</div>
          <span className="text-primary">See All Photos</span>
        </div>
        <div className="carousel carousel-center rounded-box">
          <div className="carousel-item">
            <img
              className=""
              src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
              alt="Pizza"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
              alt="Pizza"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
              alt="Pizza"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
              alt="Pizza"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
              alt="Pizza"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
              alt="Pizza"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
              alt="Pizza"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPhotos;
