const Score = ({ playerScore, computerScore }) => {
  return (
    <>
      <p>
        Player Score: <span> {playerScore} </span>
      </p>
      <p>
        Computer Score: <span> {computerScore} </span>
      </p>
    </>
  );
};

export default Score;
