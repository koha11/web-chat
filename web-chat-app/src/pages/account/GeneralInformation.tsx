const GeneralInformation = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl">
        <img
          src={`assets/images/google-logo.png`}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default GeneralInformation;
