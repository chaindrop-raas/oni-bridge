### Chaindrop Custom Gas Token Bridge Interface

OP Stack chains using custom gas tokens require different contract interactions and user experiences compared to standard ETH-based bridges. This project offers a convenient, user-friendly interface designed to resemble a standard bridge while accommodating the unique requirements of custom gas token chains. For more information about custom gas tokens on OP Stack, refer to the official [custom gas token docs](https://docs.optimism.io/stack/protocol/features/custom-gas-token).

## Caveat

Due to Tailwind CSS’s runtime evaluation, custom theme colors need to be set as environment variables loaded before Vite’s environment variables. Consequently, we use `.envrc` for Tailwind-specific variables and `.env` for other application variables. This separation ensures proper loading and application of the custom theme during development.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/JoinOrigami/op-custom-gas-token-bridge.git
   ```
2. Navigate to the project directory:
   ```bash
   cd op-custom-gas-token-bridge
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```

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

## Fair Use

This project is released under the Creative Commons BY-SA 4.0 license. You are free to use, adapt, and repurpose the code, provided that you give appropriate credit, provide a link to the license, and indicate if changes were made. Redistribution of your contributions must be under the same license. We encourage users to innovate and expand upon our work while ensuring proper attribution.

For more details, see the [LICENSE](https://github.com/JoinOrigami/op-custom-gas-token-bridge/blob/main/LICENSE) file or read more on the [Creative Commons website](https://creativecommons.org/licenses/by-sa/4.0/).

## Contributing

We welcome contributions! Please submit pull requests or open issues for any bugs or feature requests.

## License

This project is licensed under the CC-BY-SA-4.0 license. See the [LICENSE](https://github.com/JoinOrigami/op-custom-gas-token-bridge/blob/main/LICENSE) file for details.
