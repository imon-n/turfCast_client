// Service.jsx
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import Subtitle from "../../utils/Subtitle";
import Title from "../../utils/Title";

export default function Service() {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      date: null,
      time: "",
      pack: "",
    },
  });

  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const containerRef = useRef(null);

  // Location options
  const locations = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Sylhet",
    "Khulna",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];

  // Date limits: today .. today+4 (next 5 days)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 4);

  // Time slots: 12:00 - 1:00 ... 11:00 - 12:00 for AM and PM (24 slots)
  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const periods = ["AM", "PM"];
  const timeSlots = periods.flatMap((period) =>
    hours.map((h) => {
      const start = h;
      const end = (h % 12) + 1;
      return `${start}:00 - ${end}:00 ${period}`;
    })
  );

  // Packages (with Tk prices)
  const packages = [
    { id: "L", label: "Only L (Live)", price: 150 },
    { id: "R", label: "Only R (Record)", price: 120 },
    { id: "H", label: "Only H (Highlight)", price: 180 },
    { id: "LR", label: "L + R", price: 225 },
    { id: "LH", label: "L + H", price: 270 },
    { id: "RH", label: "R + H", price: 240 },
    { id: "LRH", label: "L + R + H", price: 330 },
  ];

  // close suggestions on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // keep local query in sync with form's location value (watch)
  const watchedLocation = watch("location");
  useEffect(() => {
    if (typeof watchedLocation === "string" && watchedLocation !== query) {
      setQuery(watchedLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedLocation]);

  const onSubmit = (data) => {
    // data.date is a Date object (from Controller)
    const dateStr = data.date ? data.date.toDateString() : "Not selected";
    const selectedPackage = packages.find((p) => p.id === data.pack);
    alert(
      `✅ Booking Confirmed\nLocation: ${
        data.location
      }\nDate: ${dateStr}\nTime: ${data.time}\nPackage: ${
        selectedPackage
          ? `${selectedPackage.label} (${selectedPackage.price} Tk)`
          : "—"
      }`
    );
    console.log("Booking data:", data);
  };

  return (
    <div className="bg-black">
      <div className="max-w-4xl mx-auto shadow-lg md:rounded-2xl px-6 space-y-6 bg-black  text-yellow-400 py-2 sm:py-10 md:py-14">
        <div className="flex justify-center py-2 sm:pb-6 md:pb-8 lg:pb-9">
          <Subtitle>Book Your Service</Subtitle>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          ref={containerRef}
        >
          <div className="flex flex-col sm:flex-row justify-around gap-10">
            {/* 1st 3ta--------------------------------- */}
            <div className="space-y-4">
              {/* Location (searchable, shows suggestions on focus) */}
              <div className="relative">
                <Title>Location</Title>

                <Controller
                  name="location"
                  control={control}
                  rules={{ required: "Location is required" }}
                  render={({ field: { onChange, value, ref } }) => (
                    <>
                      <input
                        ref={ref}
                        type="text"
                        value={query}
                        placeholder="Type or select location..."
                        onFocus={() => setShowSuggestions(true)}
                        onChange={(e) => {
                          const v = e.target.value;
                          setQuery(v);
                          onChange(v); // update RHF
                          setShowSuggestions(true);
                        }}
                        className="w-full border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-yellow-200"
                      />
                      {showSuggestions && (
                        <ul className="absolute z-10 bg-black border border-gray-300 rounded-lg mt-1 w-full max-h-44 overflow-y-auto shadow-lg">
                          {locations
                            .filter((loc) =>
                              loc
                                .toLowerCase()
                                .includes((query || "").toLowerCase())
                            )
                            .map((loc, i) => (
                              <li
                                key={i}
                                onClick={() => {
                                  setQuery(loc);
                                  onChange(loc); // set RHF value
                                  setShowSuggestions(false);
                                }}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                              >
                                {loc}
                              </li>
                            ))}
                        </ul>
                      )}
                    </>
                  )}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Date (react-datepicker, next 5 days only) */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Title>Date of Match</Title>
                </label>

                <Controller
                  control={control}
                  name="date"
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      minDate={today}
                      maxDate={maxDate}
                      placeholderText="Select a date"
                      dateFormat="EEE, MMM d, yyyy"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-yellow-200"
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* Time slot */}
              <div>
                <Title>Time Slot</Title>
                <select
                  {...register("time", { required: "Time is required" })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-yellow-200 bg-black"
                >
                  <option value="" className="opacity-65">
                    Select a time slot
                  </option>
                  {timeSlots.map((t, i) => (
                    <option key={i} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.time.message}
                  </p>
                )}
              </div>
            </div>

            {/* Packages (radio)--------------------------------------------- */}
            <div>
              <Title>Select Package</Title>
              <div className="grid grid-cols-1 gap-2">
                {packages.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center justify-between gap-3 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-900 "
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        {...register("pack", {
                          required: "Please select a package",
                        })}
                        value={p.id}
                        className="h-4 w-6 text-blue-600"
                      />
                      <span className="font-medium text-yellow-200">
                        {p.label}
                      </span>
                    </div>
                    <div className=" text-yellow-400">{p.price} Tk</div>
                  </label>
                ))}
              </div>
              {errors.pack && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pack.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-center ">
            <button
              type="submit"
              className=" w-[150px] sm:w-[200px] md:w-[220px]  h-[42px] sm:h-[46px] md:h-[48px] rounded-md uppercase text-sm sm:text-base md:text-lg text-center flex justify-center items-center px-4 cursor-pointer transition duration-300 bg-yellow-500 text-black mt-4 sm:mt-6 md:mt-8 lg:mt-10"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
