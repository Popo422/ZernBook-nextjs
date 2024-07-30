
import { BiHome } from "react-icons/bi";

const Intro = () => {
  return (
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Intro</h2>
        <span className="w-full text-center">Bio</span>
        <div className="card-actions ">
          <button className="btn btn-primary w-full btn-sm ">Edit Bio</button>
        </div>
        <div className="flex items-center  gap-5">
          <BiHome /> <span>Lives In {"Home"}</span>
        </div>
        <div className="card-actions ">
          <button className="btn btn-primary w-full btn-sm ">
            Edit Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Intro;
