
import { useEffect, useState } from "react";

type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Detects device type by window width using Tailwind breakpoints.
 * - mobile: <768px (md)
 * - tablet: 768px to <1024px (md to lg)
 * - desktop: >=1024px (lg and higher)
 */
export const useDeviceType = (): DeviceType => {
  const [device, setDevice] = useState<DeviceType>(
    window.innerWidth < 768
      ? "mobile"
      : window.innerWidth < 1024
      ? "tablet"
      : "desktop"
  );

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width < 768) setDevice("mobile");
      else if (width < 1024) setDevice("tablet");
      else setDevice("desktop");
    };
    window.addEventListener("resize", updateDevice);
    // Immediate check on mount
    updateDevice();
    return () => window.removeEventListener("resize", updateDevice);
  }, []);
  return device;
};
