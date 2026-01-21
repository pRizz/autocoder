#!/usr/bin/env node
/**
 * @open-autocoder/cli
 *
 * Command-line interface for the open-autocoder autonomous coding system.
 */

import { Command } from "commander";
import { logger } from "@open-autocoder/core";
import chalk from "chalk";
import ora from "ora";

const program = new Command();

const DEFAULT_PORT = 3001;
const DEFAULT_HOST = "localhost";

program
  .name("open-autocoder")
  .description("Autonomous coding agent system")
  .version("0.1.0")
  .option("-p, --port <port>", `Port to run the server on (default: ${DEFAULT_PORT})`, String(DEFAULT_PORT))
  .option("-H, --host <host>", `Host to bind to (default: ${DEFAULT_HOST})`, DEFAULT_HOST)
  .action(async (options: { port: string; host: string }) => {
    // Default action: start web server with UI
    const port = parseInt(options.port, 10);
    const host = options.host;

    console.log(chalk.blue.bold("\n🚀 Starting open-autocoder...\n"));

    const spinner = ora("Starting server...").start();

    try {
      // Dynamically import the server to avoid loading it until needed
      const { startServer } = await import("@open-autocoder/server");

      await startServer({
        port,
        host,
        serveStatic: true,
      });

      spinner.succeed(chalk.green("Server started successfully!"));
      console.log("");
      console.log(chalk.cyan(`  🌐 Web UI:    `) + chalk.white.underline(`http://${host}:${port}`));
      console.log(chalk.cyan(`  📡 API:       `) + chalk.white.underline(`http://${host}:${port}/api`));
      console.log(chalk.cyan(`  🔌 WebSocket: `) + chalk.white.underline(`ws://${host}:${port}/ws`));
      console.log("");
      console.log(chalk.dim("  Press Ctrl+C to stop the server\n"));
    } catch (error) {
      spinner.fail(chalk.red("Failed to start server"));
      if (error instanceof Error) {
        logger.logError(error);
        console.error(chalk.red(`\nError: ${error.message}`));
        if (error.message.includes("EADDRINUSE")) {
          console.error(chalk.yellow(`\n💡 Port ${port} is already in use. Try a different port with --port <port>\n`));
        }
      }
      process.exit(1);
    }
  });

// Serve command (API only, no static files)
program
  .command("serve")
  .description("Start headless API server (no web UI)")
  .option("-p, --port <port>", `Port to run the server on (default: ${DEFAULT_PORT})`, String(DEFAULT_PORT))
  .option("-H, --host <host>", `Host to bind to (default: ${DEFAULT_HOST})`, DEFAULT_HOST)
  .action(async (options: { port: string; host: string }) => {
    const port = parseInt(options.port, 10);
    const host = options.host;

    console.log(chalk.blue.bold("\n📡 Starting open-autocoder API server...\n"));

    const spinner = ora("Starting server...").start();

    try {
      const { startServer } = await import("@open-autocoder/server");

      await startServer({
        port,
        host,
        serveStatic: false,
      });

      spinner.succeed(chalk.green("API server started successfully!"));
      console.log("");
      console.log(chalk.cyan(`  📡 API:       `) + chalk.white.underline(`http://${host}:${port}/api`));
      console.log(chalk.cyan(`  🔌 WebSocket: `) + chalk.white.underline(`ws://${host}:${port}/ws`));
      console.log("");
      console.log(chalk.dim("  Press Ctrl+C to stop the server\n"));
    } catch (error) {
      spinner.fail(chalk.red("Failed to start server"));
      if (error instanceof Error) {
        logger.logError(error);
        console.error(chalk.red(`\nError: ${error.message}`));
      }
      process.exit(1);
    }
  });

// Web command (alias for default)
program
  .command("web")
  .description("Start web UI and API server (same as default command)")
  .option("-p, --port <port>", `Port to run the server on (default: ${DEFAULT_PORT})`, String(DEFAULT_PORT))
  .option("-H, --host <host>", `Host to bind to (default: ${DEFAULT_HOST})`, DEFAULT_HOST)
  .action(async (options: { port: string; host: string }) => {
    // Same as default action
    const port = parseInt(options.port, 10);
    const host = options.host;

    console.log(chalk.blue.bold("\n🚀 Starting open-autocoder...\n"));

    const spinner = ora("Starting server...").start();

    try {
      const { startServer } = await import("@open-autocoder/server");

      await startServer({
        port,
        host,
        serveStatic: true,
      });

      spinner.succeed(chalk.green("Server started successfully!"));
      console.log("");
      console.log(chalk.cyan(`  🌐 Web UI:    `) + chalk.white.underline(`http://${host}:${port}`));
      console.log(chalk.cyan(`  📡 API:       `) + chalk.white.underline(`http://${host}:${port}/api`));
      console.log(chalk.cyan(`  🔌 WebSocket: `) + chalk.white.underline(`ws://${host}:${port}/ws`));
      console.log("");
      console.log(chalk.dim("  Press Ctrl+C to stop the server\n"));
    } catch (error) {
      spinner.fail(chalk.red("Failed to start server"));
      if (error instanceof Error) {
        logger.logError(error);
      }
      process.exit(1);
    }
  });

// Project commands
program
  .command("init")
  .description("Initialize a new project")
  .argument("<name>", "Project name")
  .option("-d, --path <path>", "Project path", process.cwd())
  .action(async (name: string, options: { path: string }) => {
    logger.info(`Initializing project: ${name} at ${options.path}`);
    // Will be implemented by coding agents
  });

program
  .command("start")
  .description("Start autonomous coding session")
  .option("-c, --concurrency <number>", "Number of concurrent agents", "3")
  .option("-y, --yolo", "Enable YOLO mode (auto-approve all changes)")
  .action(async (options: { concurrency: string; yolo?: boolean }) => {
    logger.info(
      `Starting session with concurrency: ${options.concurrency}, yolo: ${options.yolo ?? false}`
    );
    // Will be implemented by coding agents
  });

program
  .command("status")
  .description("Show current project status")
  .action(async () => {
    logger.info("Showing project status...");
    // Will be implemented by coding agents
  });

program
  .command("features")
  .description("List all features")
  .option("--pending", "Show only pending features")
  .option("--passing", "Show only passing features")
  .option("--blocked", "Show only blocked features")
  .action(
    async (options: { pending?: boolean; passing?: boolean; blocked?: boolean }) => {
      logger.info("Listing features...", options);
      // Will be implemented by coding agents
    }
  );

// Provider commands
const providerCmd = program.command("provider").description("Manage AI providers");

providerCmd
  .command("add")
  .description("Add a new AI provider")
  .argument("<name>", "Provider name (anthropic, openai, etc.)")
  .action(async (name: string) => {
    logger.info(`Adding provider: ${name}`);
    // Will be implemented by coding agents
  });

providerCmd
  .command("list")
  .description("List configured providers")
  .action(async () => {
    logger.info("Listing providers...");
    // Will be implemented by coding agents
  });

// Projects subcommand
const projectsCmd = program.command("projects").description("Manage projects");

projectsCmd
  .command("list")
  .description("List all registered projects")
  .action(async () => {
    logger.info("Listing projects...");
    // Will be implemented by coding agents
  });

projectsCmd
  .command("create <name>")
  .description("Create a new project")
  .option("-d, --path <path>", "Project path", process.cwd())
  .action(async (name: string, options: { path: string }) => {
    logger.info(`Creating project: ${name} at ${options.path}`);
    // Will be implemented by coding agents
  });

projectsCmd
  .command("delete <name>")
  .description("Delete a project")
  .action(async (name: string) => {
    logger.info(`Deleting project: ${name}`);
    // Will be implemented by coding agents
  });

// Service subcommand
const serviceCmd = program.command("service").description("Manage system service");

serviceCmd
  .command("install")
  .description("Install as system service")
  .action(async () => {
    logger.info("Installing as system service...");
    // Will be implemented by coding agents
  });

serviceCmd
  .command("uninstall")
  .description("Uninstall system service")
  .action(async () => {
    logger.info("Uninstalling system service...");
    // Will be implemented by coding agents
  });

serviceCmd
  .command("start")
  .description("Start the system service")
  .action(async () => {
    logger.info("Starting system service...");
    // Will be implemented by coding agents
  });

serviceCmd
  .command("stop")
  .description("Stop the system service")
  .action(async () => {
    logger.info("Stopping system service...");
    // Will be implemented by coding agents
  });

serviceCmd
  .command("status")
  .description("Check system service status")
  .action(async () => {
    logger.info("Checking system service status...");
    // Will be implemented by coding agents
  });

// Config command
program
  .command("config")
  .description("Show or edit configuration")
  .action(async () => {
    logger.info("Showing configuration...");
    // Will be implemented by coding agents
  });

// Parse arguments
program.parse();
