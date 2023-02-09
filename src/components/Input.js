const Input = ({ inputValue, handleChange, handleGuess }) => {
  return (
    <div>
      <input
        className="bg-stone-400 px-5 py-2 w-24 rounded-md ring-0 outline-none shadow-lg text-2xl text-white font-bold text-center placeholder:text-left placeholder:text-xl placeholder:text-gray-400 "
        type="text"
        value={inputValue}
        maxLength={1}
        placeholder="try......."
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
