import ready from "../image/ready.png";

const Images = ({ incorrectGuesses }) => {
  return incorrectGuesses >= 3 && incorrectGuesses <= 4 ? (
    <>
      <div className="mt-5 w-[300px] h-[300px] mx-auto shadow-gray-600 rounded-md shadow-md p-4">
        <img src={ready} alt="img" />
      </div>
    </>
  ) : (
    ""
  );
};

export default Images;
