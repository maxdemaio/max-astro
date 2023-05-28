---
fileName: bootingLinux
description: How to install Ubuntu on a Dell XPS-13 with Windows 10
pubDate: 'Mar 04 2023'
title: Installing Ubuntu on a Dell XPS-13 with Windows 10
duration: 4
---

In this blog, we'll go over instructions for installing Ubuntu Linux on a Windows Dell XPS-13 computer. This includes creating a bootable USB drive, formatting the drive, and installing Ubuntu. It is important to back up all important data before proceeding, and additional drivers and software may need to be installed to get hardware working properly with Ubuntu.

I did this installation together with my Dad and it was a lot of fun. Hope you enjoy!

---

To install Ubuntu Linux on a Windows computer, we have a few options:

- Dual booting: This involves installing Ubuntu alongside Windows on the same computer. When you turn on your computer, you will be given the option to choose which operating system to boot into. To do this, you need to create a bootable USB drive with the Ubuntu ISO file, then restart your computer and boot from the USB drive. Follow the prompts to install Ubuntu alongside Windows.
- Virtualization: You can run Ubuntu as a virtual machine within Windows using virtualization software such as VirtualBox or VMware. This option allows you to run Ubuntu as a program within Windows, without the need to reboot your computer. However, this option may not provide optimal performance.
- WSL (Windows Subsystem for Linux): This is a feature of Windows 10 that allows you to run Linux command-line tools directly on Windows. To use WSL, you need to enable it in the Windows Features settings and then download and install Ubuntu from the Microsoft Store.
- If you want to remove Windows completely and replace it with Ubuntu Linux, you will need to perform a clean installation of Ubuntu on your computer.

In this tutorial, we will be performing a complete installation of Ubuntu Linux on a Dell XPS-13 laptop, replacing Windows entirely.

Before proceeding, it is important to back up any important data on your computer and make sure you have enough free space to install Ubuntu. It is also recommended to do some research and carefully read through the installation instructions before proceeding.

## Creating a Bootable USB Drive

You can use any USB drive with a minimum capacity of 4 GB to create a bootable drive to install Ubuntu. However, it is recommended to use a USB drive with at least 8 GB of storage to ensure that you have enough space to store the operating system and any additional software you may want to install.

Keep in mind that if you plan to use the USB drive for other purposes in the future, the contents of the drive will be deleted during the creation of the bootable drive. So, make sure to backup any important files before proceeding with the process.

## Formatting the USB Drive

To format the USB drive, we first need to install Ubuntu on it. We can download the latest stable long term support release ISO image file for Ubuntu Desktop from [ubuntu.com](https://ubuntu.com/). Once the download is complete, we can use an application called [Rufus](https://rufus.ie/en/) to create a bootable USB drive from our existing USB drive and the ISO file we downloaded. Once that's all set, we're ready to install Ubuntu Linux!

## Replacing Windows with Ubuntu Linux

Insert the bootable USB drive into your computer and restart your computer. As your computer starts up, press the appropriate key to enter the boot menu, which is usually F12 or Del. Select the USB drive from the boot menu to start the Ubuntu installation process.

Install Ubuntu: Follow the installation prompts and select the option to erase the entire disk and install Ubuntu. This will remove Windows and all its data from your computer and install Ubuntu in its place.

Complete the installation: Once the installation is complete, you will be prompted to set up your user account and other system settings.

It is important to note that this process will permanently delete all your Windows data, so make sure you have backed up all important files before proceeding. Additionally, you may need to install additional drivers and software to get your hardware working properly with Ubuntu.

For this particular laptop, I also had to disable RST in the Windows boot menu. This is because the Ubuntu installer detected a conflict. I referred to [Ubuntu's official documentation](https://help.ubuntu.com/rst/index.html) to understand how to change this.

That's it! After setting up my bootable USB drive, I was able to install Ubuntu Linux on my Dell XPS-13 laptop with Windows 10 with these steps.

## Resources

- https://www.youtube.com/watch?v=W-RFY4LQ6oE