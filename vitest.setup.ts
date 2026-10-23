import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Desmonta lo que cada prueba dibuja. Sin esto, React deja trabajo pendiente que corre cuando jsdom ya se
// cerró y el CI falla al azar con «window is not defined» (#54).
afterEach(cleanup);
