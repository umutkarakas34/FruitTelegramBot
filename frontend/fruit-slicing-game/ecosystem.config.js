module.exports = {
    apps: [
      {
        name: "NAME_OF_APPLICATION",
        script: "npm",
        args: "start",
        instances: "1",
        exec_mode: "fork",  
      }
    ]
  }