const Progress_bar = ({ progress, height }) => {
  const Parentdiv = {
    height: height,
    width: "80%",
    backgroundColor: "#a37e7e30",
    borderRadius: 40,
    margin: '2%',
  };

  const Childdiv = {
    height: "100%",
    width: `${progress}%`,
    background: "linear-gradient(90deg, #7E0000 2.7%, #390000 98.4%)",
    borderRadius: 40,
    textAlign: "right",
  };

  const progresstext = {
    marginTop: "20px",
    borderRadius: "20px",
    width: "57px",
    height: "57px",
    background: "#7E0000",
    padding: 8,
    color: "white",
  };

  return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>{`${progress}%`}</span>
      </div>
    </div>
  );
};

export default Progress_bar;
