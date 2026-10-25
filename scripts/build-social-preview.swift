#!/usr/bin/env swift
// Rebuild the share graphic on macOS; the published site needs only the PNG.
import AppKit
import Foundation

let width = 1200
let height = 630
let size = NSSize(width: CGFloat(width), height: CGFloat(height))
let output = URL(fileURLWithPath: #filePath)
    .deletingLastPathComponent().deletingLastPathComponent()
    .appendingPathComponent("dist/assets/precious-tega-blueprint-preview.png")

func color(_ hex: UInt32) -> NSColor {
    NSColor(srgbRed: CGFloat((hex >> 16) & 255) / 255,
            green: CGFloat((hex >> 8) & 255) / 255,
            blue: CGFloat(hex & 255) / 255, alpha: 1)
}

let background = color(0x080808)
let surface = color(0x141414)
let white = color(0xf9f7f8)
let muted = color(0xbfb7bd)
let pink = color(0xe75591)
let deepPink = color(0xbd1c5f)

func font(_ name: String, _ size: CGFloat) -> NSFont {
    NSFont(name: name, size: size) ?? NSFont.systemFont(ofSize: size)
}

func text(_ value: String, font: NSFont, color: NSColor) -> NSAttributedString {
    NSAttributedString(string: value, attributes: [.font: font, .foregroundColor: color])
}

func centered(_ value: NSAttributedString, y: CGFloat) {
    value.draw(at: NSPoint(x: (CGFloat(width) - value.size().width) / 2, y: y))
}

guard let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: width,
        pixelsHigh: height, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true,
        isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0),
      let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
    fatalError("Could not create the share graphic context.")
}
bitmap.size = size
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context
context.imageInterpolation = .high

background.setFill()
NSBezierPath(rect: NSRect(origin: .zero, size: size)).fill()
deepPink.setFill()
NSBezierPath(rect: NSRect(x: 0, y: CGFloat(height - 4), width: CGFloat(width), height: 4)).fill()

let name = NSMutableAttributedString(attributedString: text("Precious ", font: font("Georgia", 33), color: white))
name.append(text("Tega", font: font("Georgia-Italic", 33), color: pink))
centered(name, y: 540)
centered(text("THE COMPLETE", font: font("Arial-BoldMT", 19), color: pink), y: 462)
centered(text("Social Media Management", font: font("Georgia", 63), color: white), y: 367)
centered(text("Blueprint", font: font("Georgia-Italic", 83), color: pink), y: 262)

deepPink.setFill()
NSBezierPath(rect: NSRect(x: 440, y: 224, width: 320, height: 3)).fill()
centered(text("11 core lessons · 3 practical templates · 2 weeks of mentorship",
              font: font("Arial", 23), color: muted), y: 165)
centered(text("₦20,000", font: font("Georgia-Bold", 43), color: white), y: 76)

NSGraphicsContext.restoreGraphicsState()
guard let png = bitmap.representation(using: .png, properties: [:]) else {
    fatalError("Could not encode the share graphic.")
}
try png.write(to: output, options: .atomic)
print("Created \(output.path) (\(width) × \(height)).")
