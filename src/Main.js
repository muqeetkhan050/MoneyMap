// // import React from "react";
// // import Prism from "./components/Prism";
// // import Header from "./components/Header";

// // function Main() {
// //   return (
// //     <div style={{ position: 'relative', minHeight: '100vh', background: '#000' }}>
// //       <Header />
      
// //       {/* Fullscreen colorful Prism */}
// //       <div style={{ 
// //         position: 'fixed', 
// //         top: 64,  // Below header
// //         left: 0, 
// //         width: '100%', 
// //         height: 'calc(100vh - 64px)',
// //         zIndex: 0
// //       }}>
// //         <Prism 
// //           height={4}
// //           baseWidth={6}
// //           animationType="rotate"
// //           glow={3}               // Higher glow
// //           noise={0.1}            // Lower noise
// //           transparent={false}     
// //           scale={2.5}
// //           hueShift={0}           // Try 0, 1.5, 3.14, 4.5 for different color schemes
// //           colorFrequency={25}    // INCREASED - this is key for colors!
// //           bloom={3}              // Higher bloom
// //           timeScale={0.3}        // Slower animation
// //         />
// //       </div>

// //       {/* Content */}
// //       <main style={{ 
// //         position: 'relative', 
// //         zIndex: 1, 
// //         padding: '4rem 2rem',
// //         color: '#fff',
// //         textAlign: 'center'
// //       }}>
// //         <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
// //           Welcome to MoneyMap
// //         </h2>
// //         <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
// //           Your financial journey starts here.
// //         </p>
// //       </main>
// //     </div>
// //   );
// // }

// // export default Main;

// import React from "react";
// import Prism from "./Pages/Prism";
// import Header from "./Pages/Header";
// import Hero from "./Pages/Hero";

// function Main() {
//   return (
//     <div style={{ position: 'relative', minHeight: '100vh', background: '#000' }}>
//       <Header />
      
//       {/* Fullscreen colorful Prism background */}
//       <div style={{ 
//         position: 'fixed', 
//         top: 0, 
//         left: 0, 
//         width: '100%', 
//         height: '100vh',
//         zIndex: 0
//       }}>
//         <Prism 
//           height={4}
//           baseWidth={6}
//           animationType="rotate"
//           glow={3}
//           noise={0.1}
//           transparent={false}     
//           scale={2.5}
//           hueShift={0}
//           colorFrequency={25}
//           bloom={3}
//           timeScale={0.3}
//         />
//       </div>

//       {/* Hero content on top of Prism */}
//       <div style={{ position: 'relative', zIndex: 1 }}>
//         <Hero />
//       </div>
//     </div>
//   );
// }

// export default Main;