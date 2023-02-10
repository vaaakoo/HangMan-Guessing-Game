const Input = ({ inputValue, handleChange, handleGuess }) => {
  return (
    <div>
      <input
        className="bg-stone-400 border-black border-2 px-5 py-2 w-24 rounded-md ring-0 outline-none shadow-lg text-2xl text-white font-bold text-center"
        type="text"
        value={inputValue}
        maxLength={1}
        onChange={handleChange}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleGuess(inputValue.toLowerCase());
          }
        }}
      />
    </div>
  );
};

export default Input;
