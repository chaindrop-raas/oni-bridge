### Chaindrop OP Stack Bridge Interface

This project offers a flexible and intuitive interface for bridging assets to OP Stack rollups. It supports both standard ETH-based rollups and chains with custom gas tokens. For detailed information on custom gas tokens in the OP Stack, see the official [custom gas token docs](https://docs.optimism.io/stack/protocol/features/custom-gas-token).

## Features

- **Versatile Bridging**: Facilitates bridging to and from any OP Stack chain.
- **Custom Gas Token Compatibility**: Enables bridging to and from chains using custom gas tokens.

## Caveat

Due to Tailwind CSS’s runtime evaluation, custom theme colors need to be set as environment variables loaded before Vite’s environment variables. Consequently, we use `.envrc` for Tailwind-specific variables and `.env` for other application variables. This separation ensures proper loading and application of the custom theme during development.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/chaindrop-raas/op-custom-gas-token-bridge.git
   ```
2. Navigate to the project directory:
   ```bash
   cd op-custom-gas-token-bridge
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```

## Configuration

To enable custom gas token bridging, set the `VITE_L1_CUSTOM_GAS_TOKEN_ADDRESS` environment variable in the .env file to the address of the custom gas token’s contract on the parent chain. If you prefer to use the native currency, set `VITE_L1_CUSTOM_GAS_TOKEN_ADDRESS` to the zero address (`0x0000000000000000000000000000000000000000`).

## Running in Development

1. Ensure `.envrc` and `.env` files are properly set up by copying them from the `.example` files and updating them as needed.
2. Start the development server:
   ```bash
   yarn dev
   ```

## Compiling and Deploying for Production

1. Build the project:
   ```bash
   yarn build
   ```
2. Deploy the compiled files from the `dist` directory to your preferred hosting service as static assets.

## Contributing

We welcome contributions! Please submit pull requests or open issues for any bugs or feature requests.

This project is released under the Creative Commons BY-SA 4.0 license. You are free to use, adapt, and repurpose the code, provided you give appropriate credit, provide a link to the license, and indicate if changes were made. Redistribution of your contributions must be under the same license. We encourage users to innovate and expand upon our work while ensuring proper attribution.

For more details, see the [LICENSE](https://github.com/chaindrop-raas/op-custom-gas-token-bridge/blob/main/LICENSE) file or read more on the [Creative Commons website](https://creativecommons.org/licenses/by-sa/4.0/).
