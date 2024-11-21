// "use client";

// import { useDispatch, useSelector } from "react-redux";
// import { increment, decrement } from "@/lib/features/counter/counterSlice";
// import { RootState } from "@/lib/store";

// export default function Home() {
//   const dispatch = useDispatch();
//   const count = useSelector((state: RootState) => state.counter.count);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-2xl font-bold mb-4">Count: {count}</h1>
//       <div className="flex space-x-4">
//         <button
//           onClick={() => dispatch(increment())}
//           className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
//         >
//           +1
//         </button>
//         <button
//           onClick={() => dispatch(decrement())}
//           className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
//         >
//           -1
//         </button>
//       </div>
//     </div>
//   );
// }
